#!/bin/bash

# 自动化部署脚本
# 用于一键部署整个应用栈（后端、监控、日志、追踪）

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查命令是否存在
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# 检查 Docker
check_docker() {
    if ! command_exists docker; then
        log_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    log_info "Docker is installed: $(docker --version)"
}

# 检查 Docker Compose
check_docker_compose() {
    if ! command_exists docker-compose; then
        log_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    log_info "Docker Compose is installed: $(docker-compose --version)"
}

# 检查 Node.js
check_nodejs() {
    if ! command_exists node; then
        log_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    log_info "Node.js is installed: $(node --version)"
}

# 检查 pnpm
check_pnpm() {
    if ! command_exists pnpm; then
        log_error "pnpm is not installed. Please install pnpm first."
        log_info "Install pnpm: npm install -g pnpm"
        exit 1
    fi
    log_info "pnpm is installed: $(pnpm --version)"
}

# 安装依赖
install_dependencies() {
    log_info "Installing dependencies..."
    pnpm install
}

# 构建应用
build_app() {
    log_info "Building application..."
    pnpm build
}

# 启动 ELK 栈
start_elk() {
    log_info "Starting ELK stack..."
    chmod +x start-elk.sh stop-elk.sh
    ./start-elk.sh
    sleep 10
    log_info "Waiting for Elasticsearch to be ready..."
    until curl -s http://localhost:9200/_cluster/health > /dev/null; do
        sleep 5
    done
    log_info "Elasticsearch is ready"
}

# 初始化 ILM 策略
setup_ilm() {
    log_info "Setting up ILM policy..."
    if [ -f "setup-ilm.sh" ]; then
        chmod +x setup-ilm.sh
        ./setup-ilm.sh
    else
        log_warn "setup-ilm.sh not found, skipping ILM setup"
    fi
}

# 启动监控栈
start_monitoring() {
    log_info "Starting monitoring stack..."
    chmod +x start-monitoring.sh stop-monitoring.sh
    ./start-monitoring.sh
    sleep 5
    log_info "Monitoring stack started"
}

# 启动 Jaeger
start_jaeger() {
    log_info "Starting Jaeger distributed tracing..."
    chmod +x start-jaeger.sh stop-jaeger.sh
    ./start-jaeger.sh
    sleep 5
    log_info "Jaeger started"
}

# 启动应用
start_app() {
    log_info "Starting application..."
    # 使用 coze dev 启动应用
    cd /workspace/projects
    coze dev &
    APP_PID=$!
    log_info "Application started with PID: $APP_PID"
    echo $APP_PID > .app.pid
    sleep 5
}

# 健康检查
health_check() {
    log_info "Performing health checks..."

    # 检查应用
    if curl -s http://localhost:3000/health > /dev/null; then
        log_info "✅ Application is healthy"
    else
        log_warn "⚠️  Application health check failed"
    fi

    # 检查 Elasticsearch
    if curl -s http://localhost:9200/_cluster/health > /dev/null; then
        log_info "✅ Elasticsearch is healthy"
    else
        log_warn "⚠️  Elasticsearch health check failed"
    fi

    # 检查 Kibana
    if curl -s http://localhost:5601 > /dev/null; then
        log_info "✅ Kibana is healthy"
    else
        log_warn "⚠️  Kibana health check failed"
    fi

    # 检查 Prometheus
    if curl -s http://localhost:9090 > /dev/null; then
        log_info "✅ Prometheus is healthy"
    else
        log_warn "⚠️  Prometheus health check failed"
    fi

    # 检查 Grafana
    if curl -s http://localhost:3001 > /dev/null; then
        log_info "✅ Grafana is healthy"
    else
        log_warn "⚠️  Grafana health check failed"
    fi

    # 检查 Jaeger
    if curl -s http://localhost:16686 > /dev/null; then
        log_info "✅ Jaeger is healthy"
    else
        log_warn "⚠️  Jaeger health check failed"
    fi
}

# 显示部署信息
show_deployment_info() {
    log_info "========================================="
    log_info "Deployment completed successfully!"
    log_info "========================================="
    echo ""
    log_info "Services:"
    echo "  - Application: http://localhost:3000"
    echo "  - Health Check: http://localhost:3000/health"
    echo "  - API Docs: http://localhost:3000/api-docs"
    echo "  - Metrics: http://localhost:3000/metrics"
    echo ""
    echo "  - Elasticsearch: http://localhost:9200"
    echo "  - Kibana: http://localhost:5601"
    echo "  - Logstash: http://localhost:5044"
    echo ""
    echo "  - Prometheus: http://localhost:9090"
    echo "  - Grafana: http://localhost:3001 (admin/admin123)"
    echo "  - Alertmanager: http://localhost:9093"
    echo ""
    echo "  - Jaeger UI: http://localhost:16686"
    echo ""
    log_info "To stop all services, run: ./deploy.sh stop"
}

# 停止所有服务
stop_all() {
    log_info "Stopping all services..."

    # 停止应用
    if [ -f .app.pid ]; then
        APP_PID=$(cat .app.pid)
        if ps -p $APP_PID > /dev/null; then
            kill $APP_PID
            log_info "Application stopped"
        fi
        rm .app.pid
    fi

    # 停止 Jaeger
    if [ -f "stop-jaeger.sh" ]; then
        ./stop-jaeger.sh
    fi

    # 停止监控
    if [ -f "stop-monitoring.sh" ]; then
        ./stop-monitoring.sh
    fi

    # 停止 ELK
    if [ -f "stop-elk.sh" ]; then
        ./stop-elk.sh
    fi

    log_info "All services stopped"
}

# 重启所有服务
restart_all() {
    log_info "Restarting all services..."
    stop_all
    sleep 5
    deploy_all
}

# 查看日志
view_logs() {
    SERVICE=$1
    if [ -z "$SERVICE" ]; then
        log_error "Please specify a service: app, elk, monitoring, jaeger, all"
        exit 1
    fi

    case $SERVICE in
        app)
            log_info "Viewing application logs..."
            tail -f /app/work/logs/bypass/console.log
            ;;
        elk)
            log_info "Viewing ELK logs..."
            docker-compose logs -f
            ;;
        monitoring)
            log_info "Viewing monitoring logs..."
            docker-compose -f docker-compose.monitoring.yml logs -f
            ;;
        jaeger)
            log_info "Viewing Jaeger logs..."
            docker-compose -f docker-compose.jaeger.yml logs -f
            ;;
        all)
            log_info "Viewing all logs..."
            docker-compose logs -f &
            docker-compose -f docker-compose.monitoring.yml logs -f &
            docker-compose -f docker-compose.jaeger.yml logs -f
            ;;
        *)
            log_error "Unknown service: $SERVICE"
            exit 1
            ;;
    esac
}

# 部署所有服务
deploy_all() {
    log_info "Starting deployment..."

    check_docker
    check_docker_compose
    check_nodejs
    check_pnpm

    install_dependencies
    build_app

    start_elk
    setup_ilm
    start_monitoring
    start_jaeger
    start_app

    health_check
    show_deployment_info
}

# 主函数
main() {
    case "${1:-deploy}" in
        deploy)
            deploy_all
            ;;
        stop)
            stop_all
            ;;
        restart)
            restart_all
            ;;
        logs)
            view_logs $2
            ;;
        health)
            health_check
            ;;
        *)
            echo "Usage: $0 {deploy|stop|restart|logs <service>|health}"
            echo "Services: app, elk, monitoring, jaeger, all"
            exit 1
            ;;
    esac
}

# 捕获退出信号
trap 'log_warn "Script interrupted"; exit 1' INT TERM

# 执行主函数
main "$@"

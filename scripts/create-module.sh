#!/bin/bash

# 前端模块化快速创建脚本

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

# 显示菜单
show_menu() {
    clear
    echo -e "${BOLD}${CYAN}"
    echo "╔════════════════════════════════════════╗"
    echo "║                                        ║"
    echo "║    🚦 前端模块化快速创建工具           ║"
    echo "║                                        ║"
    echo "╚════════════════════════════════════════╝"
    echo -e "${NC}"
    echo ""
    echo -e "${BOLD}请选择要创建的类型：${NC}"
    echo ""
    echo -e "${GREEN}1.${NC} 创建组件（Component）"
    echo -e "${GREEN}2.${NC} 创建页面（Page）"
    echo -e "${GREEN}3.${NC} 创建 Hook（自定义 Hook）"
    echo -e "${GREEN}4.${NC} 创建服务层（Service）"
    echo -e "${GREEN}5.${NC} 查看项目结构"
    echo -e "${GREEN}0.${NC} 退出"
    echo ""
}

# 创建组件
create_component() {
    echo -e "\n${BOLD}${BLUE}创建组件${NC}\n"

    read -p "$(echo -e ${YELLOW}组件名称（如：OrderCard）：${NC})" component_name
    read -p "$(echo -e ${YELLOW}组件描述（可选）：${NC})" description

    # 转换为 PascalCase
    component_pascal=$(echo "$component_name" | sed 's/\b\w/\u\0/g' | sed 's/[- ]//g')

    # 创建目录
    component_dir="src/components/${component_name}"
    mkdir -p "$component_dir"

    # 创建类型文件
    cat > "$component_dir/types.ts" << TYPE_EOF
import type { FC } from 'react'

export interface ${component_pascal}Props {
  // TODO: 在这里定义 Props
  className?: string
}

export default ${component_pascal}Props
TYPE_EOF

    # 创建组件文件
    cat > "$component_dir/index.tsx" << COMPONENT_EOF
import { View, Text } from '@tarojs/components'
import type { FC } from 'react'
import type { ${component_pascal}Props } from './types'
import './index.css'

/**
 * $component_name 组件
$description
 */
export const ${component_pascal}: FC<${component_pascal}Props> = ({
  className = '',
  // TODO: 在这里解构 Props
}) => {
  return (
    <View className={'${component_name}-component ' + className}>
      {/* TODO: 在这里编写组件内容 */}
      <Text>${component_name} Component</Text>
    </View>
  )
}

export default ${component_pascal}
COMPONENT_EOF

    # 创建样式文件
    cat > "$component_dir/index.css" << CSS_EOF
.${component_name}-component {
  /* TODO: 在这里编写样式 */
}

/* 示例样式 */
.${component_name}-container {
  padding: 16px;
}

.${component_name}-title {
  font-size: 18px;
  font-weight: bold;
}
CSS_EOF

    echo -e "\n${GREEN}✅ 组件创建成功！${NC}"
    echo -e "   位置：${CYAN}${component_dir}${NC}"
    echo -e "\n${YELLOW}下一步：${NC}"
    echo -e "   1. 打开 ${CYAN}${component_dir}/index.tsx${NC} 编辑组件"
    echo -e "   2. 在 ${CYAN}${component_dir}/types.ts${NC} 定义 Props 类型"
    echo -e "   3. 在 ${CYAN}${component_dir}/index.css${NC} 编写样式"
    echo -e "\n${YELLOW}使用方法：${NC}"
    echo -e "   import { ${component_pascal} } from '@/components/${component_name}'"
    echo -e "   <${component_pascal} />"
}

# 创建页面
create_page() {
    echo -e "\n${BOLD}${BLUE}创建页面${NC}\n"

    read -p "$(echo -e ${YELLOW}页面名称（如：order-detail）：${NC})" page_name
    read -p "$(echo -e ${YELLOW}页面标题：${NC})" page_title

    # 创建目录
    page_dir="src/pages/${page_name}"
    mkdir -p "$page_dir"

    # 创建页面配置文件
    cat > "$page_dir/index.config.ts" << CONFIG_EOF
export default definePageConfig({
  navigationBarTitleText: '${page_title}',
  enablePullDownRefresh: true,
  backgroundTextStyle: 'dark',
})
CONFIG_EOF

    # 创建页面组件
    cat > "$page_dir/index.tsx" << PAGE_EOF
import { View, Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import type { FC } from 'react'
import './index.css'

/**
 * ${page_title} 页面
 */
const ${page_name}Page: FC = () => {
  useLoad(() => {
    console.log('${page_name} 页面加载')
  })

  return (
    <View className="${page_name}-page">
      {/* TODO: 在这里编写页面内容 */}
      <View className="p-4">
        <Text className="text-xl font-bold">${page_title}</Text>
      </View>
    </View>
  )
}

export default ${page_name}Page
PAGE_EOF

    # 创建样式文件
    cat > "$page_dir/index.css" << PAGE_CSS_EOF
.${page_name}-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

/* 示例样式 */
.${page_name}-container {
  padding: 16px;
}

.${page_name}-section {
  margin-bottom: 16px;
}
PAGE_CSS_EOF

    # 更新 app.config.ts
    echo -e "\n${YELLOW}正在更新 app.config.ts...${NC}"

    if [ -f "src/app.config.ts" ]; then
        # 检查页面是否已注册
        if grep -q "'pages/${page_name}/index'" src/app.config.ts; then
            echo -e "${YELLOW}⚠️  页面已在 app.config.ts 中注册${NC}"
        else
            # 在 pages 数组中添加新页面
            sed -i "/pages: \[/a\    'pages\/${page_name}\/index'," src/app.config.ts
            echo -e "${GREEN}✅ 页面已注册到 app.config.ts${NC}"
        fi
    fi

    echo -e "\n${GREEN}✅ 页面创建成功！${NC}"
    echo -e "   位置：${CYAN}${page_dir}${NC}"
    echo -e "\n${YELLOW}下一步：${NC}"
    echo -e "   1. 打开 ${CYAN}${page_dir}/index.tsx${NC} 编辑页面"
    echo -e "   2. 在 ${CYAN}${page_dir}/index.css${NC} 编写样式"
    echo -e "   3. 访问页面：${CYAN}/pages/${page_name}/index${NC}"
}

# 创建 Hook
create_hook() {
    echo -e "\n${BOLD}${BLUE}创建自定义 Hook${NC}\n"

    read -p "$(echo -e ${YELLOW}Hook 名称（如：useOrders）：${NC})" hook_name
    read -p "$(echo -e ${YELLOW}Hook 描述：${NC})" hook_description

    # 转换为 PascalCase
    hook_pascal=$(echo "$hook_name" | sed 's/\b\w/\u\0/g')

    # 创建目录
    hook_dir="src/hooks"
    mkdir -p "$hook_dir"

    # 创建 Hook 文件
    cat > "$hook_dir/${hook_name}.ts" << HOOK_EOF
import { useState, useEffect, useCallback } from 'react'

/**
 * $hook_name
 * $hook_description
 *
 * @returns {Object} Hook 返回值
 */
export const ${hook_name} = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // TODO: 在这里编写业务逻辑
  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // TODO: 发起网络请求
      // const res = await Network.request({ ... })
      // setData(res.data)
    } catch (err: any) {
      setError(err.message || '请求失败')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    refresh: fetchData
  }
}

export default ${hook_name}
HOOK_EOF

    echo -e "\n${GREEN}✅ Hook 创建成功！${NC}"
    echo -e "   位置：${CYAN}${hook_dir}/${hook_name}.ts${NC}"
    echo -e "\n${YELLOW}下一步：${NC}"
    echo -e "   1. 打开 ${CYAN}${hook_dir}/${hook_name}.ts${NC} 编辑 Hook"
    echo -e "   2. 在页面中使用："
    echo -e "      import { ${hook_name} } from '@/hooks/${hook_name}'"
    echo -e "      const { data, loading, error } = ${hook_name}()"
}

# 创建服务层
create_service() {
    echo -e "\n${BOLD}${BLUE}创建服务层${NC}\n"

    read -p "$(echo -e ${YELLOW}服务名称（如：orders）：${NC})" service_name
    read -p "$(echo -e ${YELLOW}服务描述：${NC})" service_description

    # 转换为 PascalCase
    service_pascal=$(echo "$service_name" | sed 's/\b\w/\u\0/g')

    # 创建目录
    service_dir="src/services"
    mkdir -p "$service_dir"

    # 创建服务文件
    cat > "$service_dir/${service_name}.service.ts" << SERVICE_EOF
import { Network } from '@/network'

/**
 * $service_name 服务
 * $service_description
 */
export class ${service_pascal}Service {
  private baseUrl = '/api/${service_name}'

  /**
   * 获取列表
   */
  async getList(params?: any) {
    try {
      const res = await Network.request({
        url: this.baseUrl,
        method: 'GET',
        data: params
      })
      return res.data
    } catch (error) {
      throw error
    }
  }

  /**
   * 获取详情
   */
  async getDetail(id: string) {
    try {
      const res = await Network.request({
        url: `${this.baseUrl}/${id}`,
        method: 'GET'
      })
      return res.data
    } catch (error) {
      throw error
    }
  }

  /**
   * 创建
   */
  async create(data: any) {
    try {
      const res = await Network.request({
        url: this.baseUrl,
        method: 'POST',
        data
      })
      return res.data
    } catch (error) {
      throw error
    }
  }

  /**
   * 更新
   */
  async update(id: string, data: any) {
    try {
      const res = await Network.request({
        url: `${this.baseUrl}/${id}`,
        method: 'PUT',
        data
      })
      return res.data
    } catch (error) {
      throw error
    }
  }

  /**
   * 删除
   */
  async delete(id: string) {
    try {
      const res = await Network.request({
        url: `${this.baseUrl}/${id}`,
        method: 'DELETE'
      })
      return res.data
    } catch (error) {
      throw error
    }
  }
}

export default new ${service_pascal}Service()
SERVICE_EOF

    echo -e "\n${GREEN}✅ 服务层创建成功！${NC}"
    echo -e "   位置：${CYAN}${service_dir}/${service_name}.service.ts${NC}"
    echo -e "\n${YELLOW}下一步：${NC}"
    echo -e "   1. 打开 ${CYAN}${service_dir}/${service_name}.service.ts${NC} 编辑服务"
    echo -e "   2. 在页面中使用："
    echo -e "      import ${service_pascal}Service from '@/services/${service_name}.service'"
    echo -e "      const data = await ${service_pascal}Service.getList()"
}

# 查看项目结构
show_structure() {
    echo -e "\n${BOLD}${BLUE}当前项目结构${NC}\n"

    if [ -d "src/components" ]; then
        echo -e "${GREEN}组件目录（components）：${NC}"
        ls -1 src/components 2>/dev/null | sed 's/^/  - /'
    fi

    if [ -d "src/pages" ]; then
        echo -e "\n${GREEN}页面目录（pages）：${NC}"
        ls -1 src/pages 2>/dev/null | sed 's/^/  - /'
    fi

    if [ -d "src/hooks" ]; then
        echo -e "\n${GREEN}Hook 目录（hooks）：${NC}"
        ls -1 src/hooks 2>/dev/null | sed 's/^/  - /'
    fi

    if [ -d "src/services" ]; then
        echo -e "\n${GREEN}服务目录（services）：${NC}"
        ls -1 src/services 2>/dev/null | sed 's/^/  - /'
    fi
}

# 主循环
while true; do
    show_menu
    read -p "$(echo -e ${YELLOW}请选择 (0-5)：${NC})" choice

    case $choice in
        1)
            create_component
            read -p "$(echo -e ${YELLOW}\n按回车继续...${NC})"
            ;;
        2)
            create_page
            read -p "$(echo -e ${YELLOW}\n按回车继续...${NC})"
            ;;
        3)
            create_hook
            read -p "$(echo -e ${YELLOW}\n按回车继续...${NC})"
            ;;
        4)
            create_service
            read -p "$(echo -e ${YELLOW}\n按回车继续...${NC})"
            ;;
        5)
            show_structure
            read -p "$(echo -e ${YELLOW}\n按回车继续...${NC})"
            ;;
        0)
            echo -e "\n${GREEN}再见！${NC}\n"
            exit 0
            ;;
        *)
            echo -e "\n${RED}❌ 无效选项，请重新选择${NC}"
            sleep 1
            ;;
    esac
done

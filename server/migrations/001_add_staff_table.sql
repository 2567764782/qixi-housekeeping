-- 创建 staff 表
CREATE TABLE IF NOT EXISTS staff (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(64) NOT NULL,
  phone VARCHAR(20) NOT NULL UNIQUE,
  category VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'offline',
  location VARCHAR(200),
  rating DECIMAL(3, 2) DEFAULT 0.00,
  total_orders INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- 为 staff 表添加索引
CREATE INDEX IF NOT EXISTS idx_staff_category ON staff(category);
CREATE INDEX IF NOT EXISTS idx_staff_status ON staff(status);

-- 扩展 orders 表，添加自动接单/派单相关字段
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS staff_id VARCHAR(36),
ADD COLUMN IF NOT EXISTS assigned_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS auto_confirmed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS auto_assigned BOOLEAN DEFAULT FALSE;

-- 为 orders 表添加外键约束（可选）
-- ALTER TABLE orders
-- ADD CONSTRAINT fk_orders_staff_id
-- FOREIGN KEY (staff_id) REFERENCES staff(id);

-- 为 orders 表添加索引
CREATE INDEX IF NOT EXISTS idx_orders_staff_id ON orders(staff_id);
CREATE INDEX IF NOT EXISTS idx_orders_assigned_at ON orders(assigned_at);

-- 插入测试数据 - 服务人员
INSERT INTO staff (name, phone, category, status, rating, total_orders) VALUES
('张三', '13800138001', 'cleaning', 'online', 4.8, 15),
('李四', '13800138002', 'cleaning', 'online', 4.9, 20),
('王五', '13800138003', 'renovation', 'online', 4.7, 12),
('赵六', '13800138004', 'renovation', 'online', 4.8, 18),
('钱七', '13800138005', 'cleaning', 'offline', 4.5, 8),
('孙八', '13800138006', 'renovation', 'offline', 4.6, 10)
ON CONFLICT (phone) DO NOTHING;

-- 查询验证
SELECT 'staff 表创建完成' AS message;
SELECT COUNT(*) AS staff_count FROM staff;
SELECT 'orders 表扩展完成' AS message;

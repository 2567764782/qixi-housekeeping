-- 保洁订单表
CREATE TABLE IF NOT EXISTS cleaning_orders (
  id SERIAL PRIMARY KEY,
  order_no VARCHAR(32) UNIQUE NOT NULL,
  customer_id INTEGER NOT NULL,
  customer_name VARCHAR(50) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  service_type VARCHAR(20) NOT NULL, -- cleaning, car_wash
  service_detail VARCHAR(200) NOT NULL,
  address VARCHAR(200) NOT NULL,
  latitude DECIMAL(10, 6),
  longitude DECIMAL(10, 6),
  scheduled_time TIMESTAMP NOT NULL,
  estimated_duration INTEGER, -- 预计时长（分钟）
  budget_min DECIMAL(10, 2),
  budget_max DECIMAL(10, 2),
  special_requirements TEXT,
  status VARCHAR(20) DEFAULT 'pending_review', -- pending_review, reviewing, verified, matched, accepted, in_progress, completed, cancelled
  verification_notes TEXT,
  verified_by INTEGER,
  verified_at TIMESTAMP,
  matched_cleaner_id INTEGER,
  matched_at TIMESTAMP,
  accepted_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 保洁员表
CREATE TABLE IF NOT EXISTS cleaners (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL,
  name VARCHAR(50) NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  id_card VARCHAR(18),
  avatar_url VARCHAR(500),
  service_types TEXT[] NOT NULL, -- ['cleaning', 'car_wash', 'deep_cleaning']
  service_area VARCHAR(200) NOT NULL,
  latitude DECIMAL(10, 6),
  longitude DECIMAL(10, 6),
  rating DECIMAL(3, 2) DEFAULT 0,
  total_orders INTEGER DEFAULT 0,
  completed_orders INTEGER DEFAULT 0,
  hourly_rate DECIMAL(10, 2),
  is_online BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  verification_notes TEXT,
  available_hours VARCHAR(100), -- 9:00-18:00
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 订单推送记录表
CREATE TABLE IF NOT EXISTS order_pushes (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES cleaning_orders(id) ON DELETE CASCADE,
  cleaner_id INTEGER NOT NULL REFERENCES cleaners(id) ON DELETE CASCADE,
  push_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) DEFAULT 'pending', -- pending, viewed, accepted, rejected, expired
  responded_at TIMESTAMP,
  notes TEXT
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_cleaning_orders_customer_id ON cleaning_orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_cleaning_orders_status ON cleaning_orders(status);
CREATE INDEX IF NOT EXISTS idx_cleaning_orders_scheduled_time ON cleaning_orders(scheduled_time);
CREATE INDEX IF NOT EXISTS idx_cleaning_orders_location ON cleaning_orders(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_cleaners_user_id ON cleaners(user_id);
CREATE INDEX IF NOT EXISTS idx_cleaners_service_types ON cleaners USING GIN(service_types);
CREATE INDEX IF NOT EXISTS idx_cleaners_location ON cleaners(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_cleaners_is_online ON cleaners(is_online);
CREATE INDEX IF NOT EXISTS idx_order_pushes_order_id ON order_pushes(order_id);
CREATE INDEX IF NOT EXISTS idx_order_pushes_cleaner_id ON order_pushes(cleaner_id);
CREATE INDEX IF NOT EXISTS idx_order_pushes_status ON order_pushes(status);

-- 添加注释
COMMENT ON TABLE cleaning_orders IS '保洁订单表';
COMMENT ON TABLE cleaners IS '保洁员表';
COMMENT ON TABLE order_pushes IS '订单推送记录表';

COMMENT ON COLUMN cleaning_orders.service_type IS '服务类型：cleaning=清洁，car_wash=上门洗车';
COMMENT ON COLUMN cleaning_orders.status IS '订单状态：pending_review=待审核，reviewing=审核中，verified=已验证，matched=已匹配，accepted=已接单，in_progress=进行中，completed=已完成，cancelled=已取消';
COMMENT ON COLUMN cleaners.service_types IS '服务类型数组：cleaning=清洁，car_wash=洗车，deep_cleaning=深度清洁';
COMMENT ON COLUMN cleaners.is_verified IS '是否已实名认证';
COMMENT ON COLUMN order_pushes.status IS '推送状态：pending=待查看，viewed=已查看，accepted=已接受，rejected=已拒绝，expired=已过期';

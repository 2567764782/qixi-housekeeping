-- 创建用户表
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(20) NOT NULL UNIQUE,
  nickname VARCHAR(64),
  avatar VARCHAR(500),
  gender VARCHAR(10),
  city VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_users_phone ON public.users(phone);
CREATE INDEX IF NOT EXISTS idx_users_city ON public.users(city);

-- 添加注释
COMMENT ON TABLE public.users IS '用户表';
COMMENT ON COLUMN public.users.id IS '用户ID';
COMMENT ON COLUMN public.users.phone IS '手机号';
COMMENT ON COLUMN public.users.nickname IS '昵称';
COMMENT ON COLUMN public.users.avatar IS '头像URL';
COMMENT ON COLUMN public.users.gender IS '性别: male, female';
COMMENT ON COLUMN public.users.city IS '城市';

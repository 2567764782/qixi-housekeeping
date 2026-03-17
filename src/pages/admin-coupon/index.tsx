import Taro, { useLoad } from '@tarojs/taro'
import { View, Text, ScrollView, Input } from '@tarojs/components'
import { useState } from 'react'
import { Network } from '@/network'
import { Ticket, Plus, Pencil, Trash2, ArrowLeft, Search } from 'lucide-react-taro'
import './index.css'

interface Coupon {
  id: string
  name: string
  type: 'fixed' | 'percent'
  value: number
  min_amount: number
  start_time: string
  end_time: string
  total_count: number
  used_count: number
  status: string
  description: string
}

const CouponManagePage = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null)
  const [searchKeyword, setSearchKeyword] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    type: 'fixed' as 'fixed' | 'percent',
    value: '',
    min_amount: '',
    start_time: '',
    end_time: '',
    total_count: '',
    description: ''
  })

  useLoad(() => {
    loadCoupons()
  })

  const loadCoupons = async () => {
    try {
      const res = await Network.request({
        url: '/api/admin/coupons',
        method: 'GET'
      })

      if (res.statusCode === 200 && res.data?.data) {
        setCoupons(res.data.data)
      }
    } catch (error) {
      console.error('加载优惠券失败:', error)
      // 模拟数据
      setCoupons([
        {
          id: '1',
          name: '新用户专享券',
          type: 'fixed',
          value: 20,
          min_amount: 50,
          start_time: '2024-01-01',
          end_time: '2024-12-31',
          total_count: 100,
          used_count: 30,
          status: 'active',
          description: '新用户首单立减20元'
        },
        {
          id: '2',
          name: '保洁满减券',
          type: 'fixed',
          value: 30,
          min_amount: 100,
          start_time: '2024-01-01',
          end_time: '2024-06-30',
          total_count: 50,
          used_count: 20,
          status: 'active',
          description: '保洁服务满100减30'
        }
      ])
    }
  }

  const handleSubmit = async () => {
    if (!formData.name || !formData.value) {
      Taro.showToast({ title: '请填写完整信息', icon: 'none' })
      return
    }

    try {
      const data = {
        ...formData,
        value: parseFloat(formData.value),
        min_amount: parseFloat(formData.min_amount) || 0,
        total_count: parseInt(formData.total_count) || 0
      }

      const url = editingCoupon 
        ? `/api/admin/coupons/${editingCoupon.id}`
        : '/api/admin/coupons'
      const method = editingCoupon ? 'PUT' : 'POST'

      const res = await Network.request({ url, method, data })

      if (res.statusCode === 200) {
        Taro.showToast({ title: editingCoupon ? '修改成功' : '创建成功', icon: 'success' })
        setShowForm(false)
        resetForm()
        loadCoupons()
      }
    } catch (error) {
      Taro.showToast({ title: '操作失败', icon: 'none' })
    }
  }

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon)
    setFormData({
      name: coupon.name,
      type: coupon.type,
      value: String(coupon.value),
      min_amount: String(coupon.min_amount),
      start_time: coupon.start_time.split('T')[0],
      end_time: coupon.end_time.split('T')[0],
      total_count: String(coupon.total_count),
      description: coupon.description || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (couponId: string) => {
    const confirm = await Taro.showModal({
      title: '确认删除',
      content: '删除后无法恢复，确定要删除吗？'
    })

    if (confirm.confirm) {
      try {
        const res = await Network.request({
          url: `/api/admin/coupons/${couponId}`,
          method: 'DELETE'
        })

        if (res.statusCode === 200) {
          Taro.showToast({ title: '删除成功', icon: 'success' })
          loadCoupons()
        }
      } catch (error) {
        Taro.showToast({ title: '删除失败', icon: 'none' })
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'fixed',
      value: '',
      min_amount: '',
      start_time: '',
      end_time: '',
      total_count: '',
      description: ''
    })
    setEditingCoupon(null)
  }

  const filteredCoupons = coupons.filter(c => 
    c.name.includes(searchKeyword)
  )

  const renderForm = () => (
    <View className="form-container">
      <View className="form-header">
        <Text className="form-title">{editingCoupon ? '编辑优惠券' : '新建优惠券'}</Text>
        <Text className="form-close" onClick={() => { setShowForm(false); resetForm() }}>✕</Text>
      </View>

      <ScrollView scrollY className="form-content">
        <View className="form-item">
          <Text className="form-label">优惠券名称 *</Text>
          <View className="form-input-wrap">
            <Input
              className="form-input"
              placeholder="请输入优惠券名称"
              value={formData.name}
              onInput={e => setFormData({ ...formData, name: e.detail.value })}
            />
          </View>
        </View>

        <View className="form-item">
          <Text className="form-label">优惠类型</Text>
          <View className="form-radio-group">
            <View 
              className={`form-radio ${formData.type === 'fixed' ? 'active' : ''}`}
              onClick={() => setFormData({ ...formData, type: 'fixed' })}
            >
              <Text className="form-radio-text">满减券</Text>
            </View>
            <View 
              className={`form-radio ${formData.type === 'percent' ? 'active' : ''}`}
              onClick={() => setFormData({ ...formData, type: 'percent' })}
            >
              <Text className="form-radio-text">折扣券</Text>
            </View>
          </View>
        </View>

        <View className="form-item">
          <Text className="form-label">优惠值 *</Text>
          <View className="form-input-wrap">
            <Input
              className="form-input"
              type="digit"
              placeholder={formData.type === 'fixed' ? '请输入金额（元）' : '请输入折扣（如0.85表示85折）'}
              value={formData.value}
              onInput={e => setFormData({ ...formData, value: e.detail.value })}
            />
          </View>
        </View>

        <View className="form-item">
          <Text className="form-label">最低消费</Text>
          <View className="form-input-wrap">
            <Input
              className="form-input"
              type="digit"
              placeholder="请输入最低消费金额"
              value={formData.min_amount}
              onInput={e => setFormData({ ...formData, min_amount: e.detail.value })}
            />
          </View>
        </View>

        <View className="form-row">
          <View className="form-item half">
            <Text className="form-label">开始日期</Text>
            <View className="form-input-wrap">
              <Input
                className="form-input"
                placeholder="2024-01-01"
                value={formData.start_time}
                onInput={e => setFormData({ ...formData, start_time: e.detail.value })}
              />
            </View>
          </View>
          <View className="form-item half">
            <Text className="form-label">结束日期</Text>
            <View className="form-input-wrap">
              <Input
                className="form-input"
                placeholder="2024-12-31"
                value={formData.end_time}
                onInput={e => setFormData({ ...formData, end_time: e.detail.value })}
              />
            </View>
          </View>
        </View>

        <View className="form-item">
          <Text className="form-label">发放总量</Text>
          <View className="form-input-wrap">
            <Input
              className="form-input"
              type="number"
              placeholder="请输入发放总量"
              value={formData.total_count}
              onInput={e => setFormData({ ...formData, total_count: e.detail.value })}
            />
          </View>
        </View>

        <View className="form-item">
          <Text className="form-label">使用说明</Text>
          <View className="form-input-wrap">
            <Input
              className="form-input"
              placeholder="请输入使用说明"
              value={formData.description}
              onInput={e => setFormData({ ...formData, description: e.detail.value })}
            />
          </View>
        </View>
      </ScrollView>

      <View className="form-footer">
        <View className="form-btn cancel" onClick={() => { setShowForm(false); resetForm() }}>
          <Text className="form-btn-text">取消</Text>
        </View>
        <View className="form-btn submit" onClick={handleSubmit}>
          <Text className="form-btn-text">确定</Text>
        </View>
      </View>
    </View>
  )

  return (
    <View className="page-container">
      {/* 头部 */}
      <View className="page-header">
        <View onClick={() => Taro.navigateBack()}>
          <ArrowLeft size={24} color="#2E2E30" />
        </View>
        <Text className="page-title">优惠券管理</Text>
        <View className="header-action" onClick={() => setShowForm(true)}>
          <Plus size={24} color="#F85659" />
        </View>
      </View>

      {/* 搜索栏 */}
      <View className="search-bar">
        <View className="search-input-wrap">
          <Search size={18} color="#999" />
          <Input
            className="search-input"
            placeholder="搜索优惠券名称"
            value={searchKeyword}
            onInput={e => setSearchKeyword(e.detail.value)}
          />
        </View>
      </View>

      {/* 统计信息 */}
      <View className="stats-bar">
        <View className="stat-item">
          <Text className="stat-value">{coupons.length}</Text>
          <Text className="stat-label">总数量</Text>
        </View>
        <View className="stat-item">
          <Text className="stat-value">{coupons.filter(c => c.status === 'active').length}</Text>
          <Text className="stat-label">进行中</Text>
        </View>
        <View className="stat-item">
          <Text className="stat-value">{coupons.reduce((sum, c) => sum + c.used_count, 0)}</Text>
          <Text className="stat-label">已领取</Text>
        </View>
      </View>

      {/* 列表 */}
      <ScrollView scrollY className="list-container">
        {filteredCoupons.map(coupon => (
          <View key={coupon.id} className="coupon-card">
            <View className="coupon-header">
              <View className="coupon-tag">
                <Text className="coupon-tag-text">
                  {coupon.type === 'fixed' ? '满减' : '折扣'}
                </Text>
              </View>
              <Text className="coupon-name">{coupon.name}</Text>
            </View>

            <View className="coupon-info">
              <View className="coupon-info-row">
                <Text className="coupon-info-label">优惠内容：</Text>
                <Text className="coupon-info-value">
                  {coupon.type === 'fixed' ? `满${coupon.min_amount}减${coupon.value}` : `${coupon.value * 10}折`}
                </Text>
              </View>
              <View className="coupon-info-row">
                <Text className="coupon-info-label">有效期：</Text>
                <Text className="coupon-info-value">
                  {coupon.start_time?.split('T')[0]} ~ {coupon.end_time?.split('T')[0]}
                </Text>
              </View>
              <View className="coupon-info-row">
                <Text className="coupon-info-label">领取情况：</Text>
                <Text className="coupon-info-value">{coupon.used_count}/{coupon.total_count}</Text>
              </View>
            </View>

            <View className="coupon-actions">
              <View className="action-btn edit" onClick={() => handleEdit(coupon)}>
                <Pencil size={16} color="#F85659" />
                <Text className="action-text">编辑</Text>
              </View>
              <View className="action-btn delete" onClick={() => handleDelete(coupon.id)}>
                <Trash2 size={16} color="#EF4444" />
                <Text className="action-text delete-text">删除</Text>
              </View>
            </View>
          </View>
        ))}

        {filteredCoupons.length === 0 && (
          <View className="empty-state">
            <Ticket size={48} color="#ddd" />
            <Text className="empty-text">暂无优惠券</Text>
          </View>
        )}
      </ScrollView>

      {/* 弹窗表单 */}
      {showForm && renderForm()}
    </View>
  )
}

export default CouponManagePage

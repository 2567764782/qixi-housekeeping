/**
 * 虚拟用户数据生成脚本
 * 用于生成10万个虚拟用户数据
 */

import { createClient } from '@supabase/supabase-js'
import { getSupabaseCredentials } from '../src/storage/database/supabase-client'

// 配置
const BATCH_SIZE = 1000 // 每批插入1000条
const TOTAL_USERS = 100000 // 总共10万个用户

// 姓氏列表（100个常见姓氏）
const surnames = [
  '王', '李', '张', '刘', '陈', '杨', '赵', '黄', '周', '吴',
  '徐', '孙', '胡', '朱', '高', '林', '何', '郭', '马', '罗',
  '梁', '宋', '郑', '谢', '韩', '唐', '冯', '于', '董', '萧',
  '程', '曹', '袁', '邓', '许', '傅', '沈', '曾', '彭', '吕',
  '苏', '卢', '蒋', '蔡', '贾', '丁', '魏', '薛', '叶', '阎',
  '余', '潘', '杜', '戴', '夏', '钟', '汪', '田', '任', '姜',
  '范', '方', '石', '姚', '谭', '廖', '邹', '熊', '金', '陆',
  '郝', '孔', '白', '崔', '康', '毛', '邱', '秦', '江', '史',
  '顾', '侯', '邵', '孟', '龙', '万', '段', '漕', '钱', '汤',
  '尹', '黎', '易', '常', '武', '乔', '贺', '赖', '龚', '文'
]

// 名字列表（200个常见名字）
const names = [
  '伟', '芳', '娜', '敏', '静', '强', '磊', '军', '洋', '勇',
  '艳', '杰', '娟', '涛', '明', '超', '秀', '霞', '平', '刚',
  '桂英', '玉兰', '秀英', '桂兰', '秀珍', '桂珍', '玉兰', '秀兰', '桂芳', '秀芳',
  '桂华', '秀华', '玉华', '玉珍', '玉珍', '秀珍', '桂珍', '玉兰', '秀英', '桂英',
  '建华', '建国', '建平', '建伟', '建中', '建军', '建华', '建国', '建平', '建伟',
  '小明', '小红', '小华', '小丽', '小强', '小敏', '小芳', '小杰', '小刚', '小龙',
  '丽', '娟', '敏', '燕', '慧', '婷', '秀', '霞', '玲', '燕',
  '鹏', '飞', '龙', '虎', '豹', '鹰', '杰', '豪', '俊', '帅',
  '美', '美玲', '美娟', '美华', '美芳', '美英', '美珍', '美霞', '美云', '美莲',
  '国庆', '建军', '国庆', '建军', '国庆', '建军', '国庆', '建军', '国庆', '建军',
  '志强', '志明', '志军', '志平', '志华', '志伟', '志国', '志文', '志勇', '志远',
  '晓红', '晓丽', '晓华', '晓芳', '晓敏', '晓燕', '晓娟', '晓霞', '晓婷', '晓玲',
  '文静', '文丽', '文华', '文芳', '文英', '文珍', '文霞', '文娟', '文燕', '文婷',
  '浩然', '浩宇', '浩天', '浩然', '浩宇', '浩天', '浩然', '浩宇', '浩天', '浩然',
  '子轩', '子涵', '子墨', '子豪', '子杰', '子龙', '子怡', '子萱', '子悦', '子薇',
  '一帆', '一鸣', '一诺', '一然', '一泽', '一诺', '一帆', '一鸣', '一诺', '一然',
  '雨欣', '雨涵', '雨桐', '雨婷', '雨萱', '雨萌', '雨洁', '雨璇', '雨菲', '雨泽',
  '梓涵', '梓萱', '梓萌', '梓婷', '梓璇', '梓欣', '梓菲', '梓瑶', '梓琳', '梓琪',
  '欣怡', '欣悦', '欣妍', '欣莹', '欣怡', '欣悦', '欣妍', '欣莹', '欣怡', '欣悦'
]

// 城市列表
const cities = [
  '北京', '上海', '广州', '深圳', '杭州', '成都', '重庆', '武汉', '西安', '南京',
  '苏州', '天津', '长沙', '郑州', '青岛', '大连', '宁波', '厦门', '济南', '沈阳',
  '无锡', '佛山', '东莞', '合肥', '常州', '福州', '昆明', '哈尔滨', '长春', '石家庄',
  '南昌', '贵阳', '南宁', '太原', '兰州', '呼和浩特', '海口', '银川', '西宁', '乌鲁木齐'
]

// 性别
const genders = ['male', 'female']

// 生成随机手机号
function generatePhone(index: number): string {
  const prefixes = ['130', '131', '132', '133', '134', '135', '136', '137', '138', '139',
                    '150', '151', '152', '153', '155', '156', '157', '158', '159',
                    '180', '181', '182', '183', '184', '185', '186', '187', '188', '189']
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
  // 使用 index 确保手机号唯一
  const suffix = String(10000000000 + index).slice(-8)
  return prefix + suffix
}

// 生成随机昵称
function generateNickname(index: number): string {
  const surname = surnames[Math.floor(Math.random() * surnames.length)]
  const name = names[Math.floor(Math.random() * names.length)]
  // 为了确保昵称唯一，添加数字后缀
  const suffix = index % 1000
  return `${surname}${name}${suffix > 0 ? suffix : ''}`
}

// 生成随机城市
function generateCity(): string {
  return cities[Math.floor(Math.random() * cities.length)]
}

// 生成随机性别
function generateGender(): string {
  return genders[Math.floor(Math.random() * genders.length)]
}

// 生成虚拟用户数据
interface User {
  phone: string
  nickname: string
  avatar: string | null
  gender: string
  city: string
}

function generateUsers(startIndex: number, count: number): User[] {
  const users: User[] = []
  for (let i = 0; i < count; i++) {
    const index = startIndex + i
    users.push({
      phone: generatePhone(index),
      nickname: generateNickname(index),
      avatar: null,
      gender: generateGender(),
      city: generateCity()
    })
  }
  return users
}

// 插入数据到数据库
async function insertUsers() {
  const { url, anonKey } = getSupabaseCredentials()
  const supabase = createClient(url, anonKey, {
    db: {
      timeout: 60000,
    }
  })

  try {
    console.log('连接 Supabase 数据库...')
    console.log(`数据库 URL: ${url}`)

    console.log(`开始插入 ${TOTAL_USERS} 个虚拟用户...`)
    console.log(`每批插入 ${BATCH_SIZE} 条，共 ${Math.ceil(TOTAL_USERS / BATCH_SIZE)} 批`)

    let totalInserted = 0
    let startTime = Date.now()

    for (let batch = 0; batch < Math.ceil(TOTAL_USERS / BATCH_SIZE); batch++) {
      const startIndex = batch * BATCH_SIZE
      const count = Math.min(BATCH_SIZE, TOTAL_USERS - startIndex)
      const users = generateUsers(startIndex, count)

      // 使用 Supabase 批量插入
      const { error } = await supabase
        .from('users')
        .insert(users)

      if (error) {
        console.error(`插入批次 ${batch + 1} 失败:`, error)
        throw error
      }

      totalInserted += count

      const progress = ((totalInserted / TOTAL_USERS) * 100).toFixed(2)
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(2)
      const speed = (totalInserted / parseFloat(elapsed)).toFixed(0)

      console.log(`[${progress}%] 已插入 ${totalInserted}/${TOTAL_USERS} 用户，速度: ${speed} 条/秒`)
    }

    const totalTime = ((Date.now() - startTime) / 1000).toFixed(2)
    console.log(`\n✅ 插入完成！`)
    console.log(`总用户数: ${totalInserted}`)
    console.log(`总耗时: ${totalTime} 秒`)
    console.log(`平均速度: ${(totalInserted / parseFloat(totalTime)).toFixed(0)} 条/秒`)

    // 验证插入结果
    const { count, error } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })

    if (error) {
      console.error('查询用户数失败:', error)
    } else {
      console.log(`\n数据库中的用户总数: ${count}`)
    }

  } catch (error) {
    console.error('插入失败:', error)
    throw error
  }
}

// 执行插入
insertUsers()
  .then(() => {
    console.log('\n脚本执行完成')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n脚本执行失败:', error)
    process.exit(1)
  })

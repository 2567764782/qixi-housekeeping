import Taro from '@tarojs/taro'

/**
 * 网络请求模块
 * 封装 Taro.request、Taro.uploadFile、Taro.downloadFile，自动添加项目域名前缀
 * 如果请求的 url 以 http:// 或 https:// 开头，则不会添加域名前缀
 *
 * IMPORTANT: 项目已经全局注入 PROJECT_DOMAIN
 * IMPORTANT: 除非你需要添加全局参数，如给所有请求加上 header，否则不能修改此文件
 */
export namespace Network {
    const createUrl = (url: string): string => {
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url
        }
        return `${PROJECT_DOMAIN}${url}`
    }

    /**
     * 获取请求头，自动添加 JWT token
     */
    const getHeaders = (headers: Record<string, string> = {}): Record<string, string> => {
        const token = Taro.getStorageSync('token')

        if (token && !headers.Authorization) {
            return {
                ...headers,
                Authorization: `Bearer ${token}`,
            }
        }

        return headers
    }

    /**
     * 处理响应，处理 401 未授权错误
     */
    const handleResponse = (response: any): void => {
        console.log('[Network Response]', {
            status: response.statusCode,
            data: response.data,
        })

        // 处理 401 未授权错误
        if (response.statusCode === 401) {
            Taro.removeStorageSync('token')
            Taro.removeStorageSync('userInfo')

            Taro.showToast({
                title: '登录已过期，请重新登录',
                icon: 'none',
            })

            setTimeout(() => {
                Taro.redirectTo({
                    url: '/pages/login/index',
                })
            }, 1500)
        }
    }

    export const request: typeof Taro.request = option => {
        const url = createUrl(option.url)
        const headers = getHeaders(option.header)

        console.log('[Network Request]', {
            url,
            method: option.method,
            data: option.data,
            headers,
        })

        const task = Taro.request({
            ...option,
            url,
            header: headers,
        })

        // 拦截响应
        const originalThen = task.then.bind(task)
        task.then = function (onFulfilled?: any, onRejected?: any) {
            return originalThen(
                (response: any) => {
                    handleResponse(response)
                    return onFulfilled ? onFulfilled(response) : response
                },
                (error: any) => {
                    console.error('[Network Error]', error)

                    Taro.showToast({
                        title: '网络请求失败',
                        icon: 'none',
                    })

                    return onRejected ? onRejected(error) : Promise.reject(error)
                }
            )
        }

        return task
    }

    export const uploadFile: typeof Taro.uploadFile = option => {
        const url = createUrl(option.url)
        const headers = getHeaders(option.header)

        console.log('[Network Upload]', {
            url,
            filePath: option.filePath,
            name: option.name,
        })

        const task = Taro.uploadFile({
            ...option,
            url,
            header: headers,
        })

        // 拦截响应
        const originalThen = task.then.bind(task)
        task.then = function (onFulfilled?: any, onRejected?: any) {
            return originalThen(
                (response: any) => {
                    handleResponse(response)
                    return onFulfilled ? onFulfilled(response) : response
                },
                (error: any) => {
                    console.error('[Network Upload Error]', error)

                    Taro.showToast({
                        title: '文件上传失败',
                        icon: 'none',
                    })

                    return onRejected ? onRejected(error) : Promise.reject(error)
                }
            )
        }

        return task
    }

    export const downloadFile: typeof Taro.downloadFile = option => {
        const url = createUrl(option.url)
        const headers = getHeaders(option.header)

        console.log('[Network Download]', {
            url,
        })

        const task = Taro.downloadFile({
            ...option,
            url,
            header: headers,
        })

        // 拦截响应
        const originalThen = task.then.bind(task)
        task.then = function (onFulfilled?: any, onRejected?: any) {
            return originalThen(
                (response: any) => {
                    handleResponse(response)
                    return onFulfilled ? onFulfilled(response) : response
                },
                (error: any) => {
                    console.error('[Network Download Error]', error)

                    Taro.showToast({
                        title: '文件下载失败',
                        icon: 'none',
                    })

                    return onRejected ? onRejected(error) : Promise.reject(error)
                }
            )
        }

        return task
    }
}

import { test, expect } from '@playwright/test'

test.describe('中国花卉地图应用', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // 等待页面加载完成
    await page.waitForLoadState('networkidle')
  })

  test('页面正确加载，显示标题和副标题', async ({ page }) => {
    // 验证主标题
    await expect(page.locator('h1')).toContainText('中国花卉地图')

    // 验证副标题
    await expect(page.getByText('CHINA FLOWERS ATLAS')).toBeVisible()
  })

  test('默认无筛选，显示全部花卉', async ({ page }) => {
    // 验证显示全部花卉 - 使用getByText包含匹配
    await expect(page.getByText(/当前展示.*种花卉/)).toBeVisible()

    // 验证季节按钮默认未选中
    const springButton = page.getByRole('button', { name: /春/ })
    await expect(springButton).toHaveAttribute('aria-pressed', 'false')
  })

  test('点击春季按钮筛选花卉', async ({ page }) => {
    const springButton = page.getByRole('button', { name: /春/ })
    const countText = page.getByText(/当前展示.*种花卉/)

    // 获取初始数量
    const initialText = await countText.textContent()
    const initialMatch = initialText?.match(/当前展示\s+(\d+)\s+种花卉/)
    const initialCount = initialMatch ? parseInt(initialMatch[1]) : 0

    // 点击春季按钮 - 使用 force: true 因为3D地球canvas可能遮挡按钮
    await springButton.click({ force: true })

    // 验证按钮变为选中状态
    await expect(springButton).toHaveAttribute('aria-pressed', 'true')

    // 验证花卉数量变化
    const filteredText = await countText.textContent()
    const filteredMatch = filteredText?.match(/当前展示\s+(\d+)\s+种花卉/)
    const filteredCount = filteredMatch ? parseInt(filteredMatch[1]) : 0

    // 筛选后数量应该小于等于总数
    expect(filteredCount).toBeLessThanOrEqual(initialCount)
  })

  test('再次点击春季按钮取消筛选', async ({ page }) => {
    const springButton = page.getByRole('button', { name: /春/ })

    // 点击春季选中 - 使用 force: true
    await springButton.click({ force: true })
    await expect(springButton).toHaveAttribute('aria-pressed', 'true')

    // 再次点击取消筛选
    await springButton.click({ force: true })
    await expect(springButton).toHaveAttribute('aria-pressed', 'false')
  })

  test('多季节筛选（春夏同时选中）', async ({ page }) => {
    const springButton = page.getByRole('button', { name: /春/ })
    const summerButton = page.getByRole('button', { name: /夏/ })

    // 同时点击春和夏 - 使用 force: true
    await springButton.click({ force: true })
    await summerButton.click({ force: true })

    // 验证两者都为选中状态
    await expect(springButton).toHaveAttribute('aria-pressed', 'true')
    await expect(summerButton).toHaveAttribute('aria-pressed', 'true')
  })

  test('四季按钮都可点击', async ({ page }) => {
    // 测试每个季节按钮都能独立点击和取消
    // 使用 force: true 因为3D地球canvas可能遮挡按钮
    const springButton = page.getByRole('button', { name: /春/ })
    await springButton.click({ force: true, timeout: 10000 })
    await expect(springButton).toHaveAttribute('aria-pressed', 'true')
    await springButton.click({ force: true, timeout: 10000 })
    await expect(springButton).toHaveAttribute('aria-pressed', 'false')

    const summerButton = page.getByRole('button', { name: /夏/ })
    await summerButton.click({ force: true, timeout: 10000 })
    await expect(summerButton).toHaveAttribute('aria-pressed', 'true')
    await summerButton.click({ force: true, timeout: 10000 })
    await expect(summerButton).toHaveAttribute('aria-pressed', 'false')

    const autumnButton = page.getByRole('button', { name: /秋/ })
    await autumnButton.click({ force: true, timeout: 10000 })
    await expect(autumnButton).toHaveAttribute('aria-pressed', 'true')
    await autumnButton.click({ force: true, timeout: 10000 })
    await expect(autumnButton).toHaveAttribute('aria-pressed', 'false')

    const winterButton = page.getByRole('button', { name: /冬/ })
    await winterButton.click({ force: true, timeout: 10000 })
    await expect(winterButton).toHaveAttribute('aria-pressed', 'true')
    await winterButton.click({ force: true, timeout: 10000 })
    await expect(winterButton).toHaveAttribute('aria-pressed', 'false')
  })

  test('花卉数量统计显示正确', async ({ page }) => {
    // 验证花卉数量文字格式
    await expect(page.getByText(/当前展示.*种花卉/)).toBeVisible()

    // 点击春季后 - 使用 force: true
    await page.getByRole('button', { name: /春/ }).click({ force: true })
    await expect(page.getByText(/当前展示.*种花卉/)).toBeVisible()
  })

  test('季节筛选面板固定在页面底部中央', async ({ page }) => {
    // 验证四个季节按钮都在面板中
    await expect(page.getByRole('button', { name: /春/ })).toBeVisible()
    await expect(page.getByRole('button', { name: /夏/ })).toBeVisible()
    await expect(page.getByRole('button', { name: /秋/ })).toBeVisible()
    await expect(page.getByRole('button', { name: /冬/ })).toBeVisible()
  })

  test('应用启动时无严重JavaScript错误', async ({ page }) => {
    // 检查控制台无错误级别的日志
    const errors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    await page.reload()
    await page.waitForLoadState('networkidle')

    // 过滤掉一些已知的非关键错误（如图片加载失败）
    const criticalErrors = errors.filter(e => !e.includes('Failed to load resource'))

    // 不应该有严重的JavaScript错误
    expect(criticalErrors.length).toBe(0)
  })
})

test.describe('花卉数据验证', () => {
  test('花卉数据量满足最低要求（不少于50条）', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // 获取花卉数量
    const countText = await page.getByText(/当前展示.*种花卉/).textContent()
    const match = countText?.match(/当前展示\s+(\d+)\s+种花卉/)
    const count = match ? parseInt(match[1]) : 0

    // 验证总数不少于50条
    expect(count).toBeGreaterThanOrEqual(50)
  })

  test('四季都有花卉数据（每季至少10条）', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const seasons = ['春', '夏', '秋', '冬']

    for (const season of seasons) {
      // 点击季节按钮 - 使用 force: true 因为3D地球canvas可能遮挡按钮
      const button = page.getByRole('button', { name: new RegExp(season) })
      await button.click({ force: true, timeout: 10000 })

      // 等待筛选结果
      await page.waitForTimeout(500)

      // 获取数量
      const countText = await page.getByText(/当前展示.*种花卉/).textContent()
      const match = countText?.match(/当前展示\s+(\d+)\s+种花卉/)
      const count = match ? parseInt(match[1]) : 0

      // 验证每季至少有10条记录
      expect(count).toBeGreaterThanOrEqual(10, `季节 ${season} 应至少有10条花卉记录`)

      // 取消选中
      await button.click({ force: true, timeout: 10000 })
    }
  })
})

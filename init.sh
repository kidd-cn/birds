#!/bin/bash
# 微信小程序初始化脚本

echo "深圳市鸟类分布地图小程序 - 项目初始化"
echo "====================================="

echo "项目结构检查..."
if [ -d "miniprogram" ]; then
    echo "✓ miniprogram 目录存在"
else
    echo "✗ miniprogram 目录不存在"
    exit 1
fi

if [ -f "miniprogram/app.json" ]; then
    echo "✓ app.json 存在"
else
    echo "✗ app.json 不存在"
    exit 1
fi

if [ -f "miniprogram/app.js" ]; then
    echo "✓ app.js 存在"
else
    echo "✗ app.js 不存在"
    exit 1
fi

if [ -f "project.config.json" ]; then
    echo "✓ project.config.json 存在"
else
    echo "✗ project.config.json 不存在"
    exit 1
fi

echo ""
echo "检查页面文件..."

if [ -d "miniprogram/pages/index" ]; then
    echo "✓ index 页面目录存在"

    files=("index.js" "index.json" "index.wxml" "index.wxss")
    for file in "${files[@]}"; do
        if [ -f "miniprogram/pages/index/$file" ]; then
            echo "  ✓ $file 存在"
        else
            echo "  ✗ $file 不存在"
        fi
    done
else
    echo "✗ index 页面目录不存在"
fi

echo ""
echo "检查云函数..."

cloud_functions=("getBirdData" "addBirdData")
for func in "${cloud_functions[@]}"; do
    if [ -d "cloudfunctions/$func" ]; then
        echo "✓ $func 云函数目录存在"

        files=("index.js" "config.json" "package.json")
        for file in "${files[@]}"; do
            if [ -f "cloudfunctions/$func/$file" ]; then
                echo "  ✓ $file 存在"
            else
                echo "  ✗ $file 不存在"
            fi
        done
    else
        echo "✗ $func 云函数目录不存在"
    fi
done

echo ""
echo "项目初始化完成!"
echo ""
echo "要运行此微信小程序，请："
echo "1. 打开微信开发者工具"
echo "2. 点击 '添加项目'"
echo "3. 选择此目录作为项目路径"
echo "4. 输入 AppID (已在 project.config.json 中配置)"
echo "5. 确保已开通云开发环境"
echo ""
echo "项目功能:"
echo "- 交互式地图展示深圳市鸟类分布"
echo "- 点击地图标记查看鸟类详细信息"
echo "- 支持鸟类图片和音频播放"
echo "- 云端数据存储和管理"
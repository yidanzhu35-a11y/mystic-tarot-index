#!/usr/bin/env python3

# 卡牌名称映射
card_mapping = {
    'tarot_major_0': '0愚人',
    'tarot_major_1': '1魔术师',
    'tarot_major_2': '2女祭司',
    'tarot_major_3': '3皇后',
    'tarot_major_4': '4皇帝',
    'tarot_major_5': '5教皇',
    'tarot_major_6': '6恋人',
    'tarot_major_7': '7战车',
    'tarot_major_8': '8力量',
    'tarot_major_9': '9隐士',
    'tarot_major_10': '10命运之轮',
    'tarot_major_11': '11正义',
    'tarot_major_12': '12倒吊人',
    'tarot_major_13': '13死神',
    'tarot_major_14': '14节制',
    'tarot_major_15': '15恶魔',
    'tarot_major_16': '16塔',
    'tarot_major_17': '17星星',
    'tarot_major_18': '18月亮',
    'tarot_major_19': '19太阳',
    'tarot_major_20': '20审判',
    'tarot_major_21': '21世界',
    'tarot_wands_ace': '权杖1',
    'tarot_wands_2': '权杖2',
    'tarot_wands_3': '权杖3',
    'tarot_wands_4': '权杖4',
    'tarot_wands_5': '权杖5',
    'tarot_wands_6': '权杖6',
    'tarot_wands_7': '权杖7',
    'tarot_wands_8': '权杖8',
    'tarot_wands_9': '权杖9',
    'tarot_wands_10': '权杖10',
    'tarot_wands_page': '权杖侍从',
    'tarot_wands_knight': '权杖骑士',
    'tarot_wands_queen': '权杖王后',
    'tarot_wands_king': '权杖国王',
    'tarot_cups_ace': '圣杯1',
    'tarot_cups_2': '圣杯2',
    'tarot_cups_3': '圣杯3',
    'tarot_cups_4': '圣杯4',
    'tarot_cups_5': '圣杯5',
    'tarot_cups_6': '圣杯6',
    'tarot_cups_7': '圣杯7',
    'tarot_cups_8': '圣杯8',
    'tarot_cups_9': '圣杯9',
    'tarot_cups_10': '圣杯10',
    'tarot_cups_page': '圣杯侍从',
    'tarot_cups_knight': '圣杯骑士',
    'tarot_cups_queen': '圣杯王后',
    'tarot_cups_king': '圣杯国王',
    'tarot_swords_ace': '宝剑1',
    'tarot_swords_2': '宝剑2',
    'tarot_swords_3': '宝剑3',
    'tarot_swords_4': '宝剑4',
    'tarot_swords_5': '宝剑5',
    'tarot_swords_6': '宝剑6',
    'tarot_swords_7': '宝剑7',
    'tarot_swords_8': '宝剑8',
    'tarot_swords_9': '宝剑9',
    'tarot_swords_10': '宝剑10',
    'tarot_swords_page': '宝剑侍从',
    'tarot_swords_knight': '宝剑骑士',
    'tarot_swords_queen': '宝剑王后',
    'tarot_swords_king': '宝剑国王',
    'tarot_pentacles_ace': '星币1',
    'tarot_pentacles_2': '星币2',
    'tarot_pentacles_3': '星币3',
    'tarot_pentacles_4': '星币4',
    'tarot_pentacles_5': '星币5',
    'tarot_pentacles_6': '星币6',
    'tarot_pentacles_7': '星币7',
    'tarot_pentacles_8': '星币8',
    'tarot_pentacles_9': '星币9',
    'tarot_pentacles_10': '星币10',
    'tarot_pentacles_page': '星币侍从',
    'tarot_pentacles_knight': '星币骑士',
    'tarot_pentacles_queen': '星币王后',
    'tarot_pentacles_king': '星币国王'
}

# 读取文件内容
with open('constants.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 替换所有图片路径
for key, value in card_mapping.items():
    old_path = f'https://picsum.photos/seed/{key}/300/500'
    new_path = f'/picture540/{value}.png'
    content = content.replace(old_path, new_path)

# 写回文件
with open('constants.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print('图片路径替换完成！')
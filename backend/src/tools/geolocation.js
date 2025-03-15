import axios from 'axios';

export async function getGeolocation(address) {
  try {
    const response = await axios.get(
      `https://restapi.amap.com/v3/geocode/geo?address=${encodeURIComponent(address)}&key=${process.env.AMAP_API_KEY}`
    );

    if (!response.data.geocodes || response.data.geocodes.length === 0) {
      return `抱歉，找不到地址"${address}"的信息。`;
    }

    const location = response.data.geocodes[0];
    return `${address}的地理位置：\n- 详细地址：${location.formatted_address}\n- 经度：${location.location.split(',')[0]}\n- 纬度：${location.location.split(',')[1]}`;
  } catch (error) {
    console.error('获取地理位置失败:', error);
    return `获取${address}的地理位置失败，请稍后重试。`;
  }
} 
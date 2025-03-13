import axios from 'axios';

export async function getWeather(city) {
  try {
    // 获取城市ID
    const locationResponse = await axios.get(
      `https://geoapi.qweather.com/v2/city/lookup?location=${encodeURIComponent(city)}&key=${process.env.QWEATHER_API_KEY}`
    );

    if (!locationResponse.data.location || locationResponse.data.location.length === 0) {
      return `抱歉，找不到城市"${city}"的信息。`;
    }

    const cityId = locationResponse.data.location[0].id;

    // 获取天气信息
    const weatherResponse = await axios.get(
      `https://devapi.qweather.com/v7/weather/now?location=${cityId}&key=${process.env.QWEATHER_API_KEY}`
    );

    const weather = weatherResponse.data.now;
    return `${city}当前天气：${weather.text}，温度${weather.temp}°C，体感温度${weather.feelsLike}°C，相对湿度${weather.humidity}%，风向${weather.windDir}，风速${weather.windScale}级。`;
  } catch (error) {
    console.error('获取天气信息失败:', error);
    return `获取${city}的天气信息失败，请稍后重试。`;
  }
} 
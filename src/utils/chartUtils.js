export const formatPostsByDate = (posts) => {
    const postsByDate = posts.reduce((acc, post) => {
      const postDate = new Date(post.time * 1000).toISOString().slice(0, 10);
      if (acc[postDate]) {
        acc[postDate].count++;
      } else {
        acc[postDate] = { date: postDate, count: 1 };
      }
      return acc;
    }, {});
  
    return Object.values(postsByDate);
  };
  
  export const getMonthlyDataFromAnnualData = (annualData) => {
    const monthlyData = [];
  
    for (const [date, count] of Object.entries(annualData)) {
      const year = date.slice(0, 4);
      const month = date.slice(5, 7);
      const monthIndex = parseInt(month) - 1;
  
      let existingMonthData = monthlyData.find(
        (item) => item.year === year && item.month === monthIndex
      );
      if (!existingMonthData) {
        existingMonthData = { year, month: monthIndex, count: 0 };
        monthlyData.push(existingMonthData);
      }
      existingMonthData.count += count;
    }
  
    return monthlyData.sort((a, b) => a.year - b.year || a.month - b.month);
  };
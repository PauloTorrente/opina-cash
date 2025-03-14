export const processChartData = (responses) => {
    const chartData = {};
  
    responses.forEach((response) => {
      const { question, answer } = response;
  
      if (!chartData[question]) {
        chartData[question] = {};
      }
  
      if (!chartData[question][answer]) {
        chartData[question][answer] = 0;
      }
  
      chartData[question][answer] += 1;
    });
  
    // Converte o objeto em um array para o gráfico
    return Object.keys(chartData).map((question) => ({
      question,
      answers: Object.keys(chartData[question]).map((answer) => ({
        answer,
        count: chartData[question][answer],
      })),
    }));
  };
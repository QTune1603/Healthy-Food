import { onCLS, onINP, onLCP } from 'web-vitals';


//Hàm báo cáo chỉ số web vitals
const reportWebVitals = (metric) => {
    console.log(metric);
};

onCLS(reportWebVitals);
onINP(reportWebVitals);
onLCP(reportWebVitals);

export default reportWebVitals;
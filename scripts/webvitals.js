import { onCLS, onINP, onLCP } from 'https://unpkg.com/web-vitals@3?module';

function sendToPlausible(metric) {
  if (window.plausible) {
    window.plausible('web-vital', {
      props: {
        name: metric.name,
        value: metric.value,
      },
    });
  }
}

window.addEventListener('load', () => {
  onLCP(sendToPlausible);
  onCLS(sendToPlausible);
  onINP(sendToPlausible);
});


const ctx = document.getElementById('balanceChart').getContext('2d');
const balanceChart = new Chart(ctx, {
    type: 'bar', // Changed from 'line' to 'bar'
    data: {
        labels: [], // Flip count
        datasets: [
            {
                label: 'Player Poor %',
                backgroundColor: 'blue', // Bar color
                data: []
            },
            {
                label: 'Player Rich %',
                backgroundColor: 'red', // Bar color
                data: []
            }
        ]
    },
    options: {
        responsive: true,
        scales: {
            x: { title: { display: true, text: 'Flips' } },
            y: { 
                title: { display: true, text: 'Percentage of Total Wealth' },
                min: 0,
                max: 100
            }
        }
    }
});

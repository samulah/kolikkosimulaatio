document.addEventListener("DOMContentLoaded", function () {
    let playerPoorBalance = 10;
    let playerRichBalance = 1000;
    let playerPoorMax = 10;
    let playerRichMax = 1000;
    let flipCount = 0;
    let flipLimit = null;
    let simulationInterval = null;
    const batchSize = 5000; // Flipping in 5000 batches
    let flipResults = [];
    let poorWinsCount = 0;
    let richWinsCount = 0;

    // Get elements
    const poorBalanceText = document.getElementById('poorBalance');
    const richBalanceText = document.getElementById('richBalance');
    const poorWinsText = document.getElementById('poorWins');
    const richWinsText = document.getElementById('richWins');
    const resultsTable = document.querySelector('#resultsTable tbody');
    const startPoorInput = document.getElementById('startPoorBalance');
    const startRichInput = document.getElementById('startRichBalance');
    const flipLimitInput = document.getElementById('flipLimit');

    function flipBatch() {
        let batchFlips = 0;

        for (let i = 0; i < batchSize; i++) {
            if (playerPoorBalance <= 0 || playerRichBalance <= 0 || (flipLimit !== null && flipCount >= flipLimit)) {
                stopSimulation();
                alert(playerPoorBalance <= 0 ? "Player Rich Wins!" : "Player Poor Wins!");
                return;
            }

            const betPoor = playerPoorMax * 0.01;
            const betRich = playerRichMax * 0.01;
            let betAmount = Math.min(betPoor, betRich, playerPoorBalance, playerRichBalance);
            betAmount = Math.max(betAmount, 1); // Ensure minimum bet is 1 €

            const poorWins = Math.random() < 0.5;
            const winner = poorWins ? "Poor" : "Rich";

            if (poorWins) {
                playerPoorBalance += betAmount;
                playerRichBalance -= betAmount;
                poorWinsCount++;
            } else {
                playerPoorBalance -= betAmount;
                playerRichBalance += betAmount;
                richWinsCount++;
            }

            flipCount++;
            batchFlips++;

            flipResults.push(`
                <tr>
                    <td>${flipCount}</td>
                    <td>${winner}</td>
                    <td>${betAmount.toFixed(2)} €</td>
                    <td>${playerPoorBalance.toFixed(2)} €</td>
                    <td>${playerRichBalance.toFixed(2)} €</td>
                </tr>
            `);
        }

        if (batchFlips > 0) {
            resultsTable.innerHTML = flipResults.join('') + resultsTable.innerHTML;
            flipResults = [];
        }

        poorBalanceText.textContent = playerPoorBalance.toFixed(2);
        richBalanceText.textContent = playerRichBalance.toFixed(2);
        poorWinsText.textContent = poorWinsCount;
        richWinsText.textContent = richWinsCount;

        // Update chart
        balanceChart.data.labels.push(flipCount);
        balanceChart.data.datasets[0].data.push(playerPoorBalance);
        balanceChart.data.datasets[1].data.push(playerRichBalance);
        balanceChart.update();
    }

    function startSimulation() {
        // Get user input values
        playerPoorBalance = parseFloat(startPoorInput.value) || 100;
        playerRichBalance = parseFloat(startRichInput.value) || 1000;
        playerPoorMax = playerPoorBalance;
        playerRichMax = playerRichBalance;
        flipLimit = flipLimitInput.value ? parseInt(flipLimitInput.value) : null;
        flipCount = 0;
        poorWinsCount = 0;
        richWinsCount = 0;
        resultsTable.innerHTML = ""; // Clear table for new run
        balanceChart.data.labels = [];
        balanceChart.data.datasets[0].data = [];
        balanceChart.data.datasets[1].data = [];
        balanceChart.update();

        if (!simulationInterval) {
            simulationInterval = setInterval(flipBatch, 0.1);
        }
    }

    function stopSimulation() {
        if (simulationInterval) {
            clearInterval(simulationInterval);
            simulationInterval = null;
        }

        if (flipResults.length > 0) {
            resultsTable.innerHTML = flipResults.join('') + resultsTable.innerHTML;
            flipResults = [];
        }
    }

    window.startSimulation = startSimulation;
    window.stopSimulation = stopSimulation;
});

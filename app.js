var app = angular.module("pokeTrumps", []);

app.controller('trumpsController', function($scope, $http) {
    $scope.log = ['Welcome to the game! To get started, pick an attribute to compare it to your opponents\'. Try to beat their score!', '---'];
    $scope.turn = 'player';
    $scope.winner = null;
    $scope.playerCards = drawCards(5);
    $scope.computerCards = drawCards(5);
    $scope.hideComputerCard = true;
    $scope.hidePlayerCard = false;
    $scope.incrementCard = () => $scope.currentCard += 1;
    $scope.selectAttr = (attr) => {
        $scope.hidePlayerCard = true;
        setTimeout(() => calculateWinner(attr), 1000);
    }
    $scope.resetGame = () => location.reload();

    function calculateWinner(attr) {
        // get this value on player card
        const playerScore = $scope.playerCards[0].stats.find(stat => stat.label === attr).val;
        const playerCardName = $scope.playerCards[0].name;
        log(`Player's card is ${playerCardName.charAt(0).toUpperCase() + playerCardName.slice(1)}`);
        log(`Player's ${attr} is ${playerScore}`);

        // get this value on computer card
        const computerScore = $scope.computerCards[0].stats.find(stat => stat.label === attr).val;
        const computerCardName = $scope.computerCards[0].name;
        log(`Computer's card is ${computerCardName.charAt(0).toUpperCase() + computerCardName.slice(1)}`);
        log(`Computer's ${attr} is ${computerScore}`);

        // compare
        const winner = playerScore > computerScore ? 'player' : 'computer';
        log(`The ${winner} wins this round!`);
        log('---');

        setTimeout(() => rotateCards(winner), 1000);
    }

    function rotateCards(winner) {
        // push both cards to the end of the winner's hand
        const playerCard = $scope.playerCards.shift();
        const computerCard = $scope.computerCards.shift();
        $scope[`${winner}Cards`].push(playerCard, computerCard);
        $scope.turn = winner;
        $scope.hidePlayerCard = false;
        $scope.$apply();

        if ($scope.computerCards.length === 0) {
            $scope.winner = 'player';
            log(`The player wins the game!`);
            return;
        } else if ($scope.playerCards.length === 0) {
            $scope.winner = 'computer';
            log(`The computer wins the game!`);
            return;
        }

        if (winner === 'computer') {
            computerTurn();
        }
    }

    function drawCards(quantity) {
            let ids = [];
            let cards = [];
            for(let i = 0; i < quantity; i++) {
                ids.push(Math.floor(Math.random() * 150) + 1);
            }
            ids.forEach((id) => {
                $http.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
                    .then(
                        ({ data, data: { name, height, weight, id, stats } }) => {
                            console.log(data);
                            cards.push({
                                name,
                                id,
                                img: `https://pokeres.bastionbot.org/images/pokemon/${id}.png`,
                                stats: [
                                    {
                                        label: 'Height',
                                        val: height / 10,
                                        unit: 'm'
                                    },
                                    {
                                        label: 'Weight',
                                        val: weight / 10,
                                        unit: 'kg'
                                    },
                                    {
                                        label: 'HP',
                                        val: getBaseStat(stats, 'hp'),
                                        unit: null
                                    },
                                    {
                                        label: 'Attack',
                                        val: getBaseStat(stats, 'attack'),
                                        unit: null
                                    },
                                    {
                                        label: 'Defense',
                                        val: getBaseStat(stats, 'defense'),
                                        unit: null
                                    },
                                    {
                                        label: 'SP. Attack',
                                        val: getBaseStat(stats, 'special-attack'),
                                        unit: null
                                    },
                                    {
                                        label: 'SP. Defense',
                                        val: getBaseStat(stats, 'special-defense'),
                                        unit: null
                                    },
                                    {
                                        label: 'Speed',
                                        val: getBaseStat(stats, 'speed'),
                                        unit: null
                                    },
                                ]
                            });
                        },
                        () => {}
                    );
            });
            return cards;
    }

    function getBaseStat(stats, targetStat) {
        return stats.find(thisStat => thisStat.stat.name === targetStat).base_stat
    }

    function log(text) {
        $scope.log.push(text);
        updateScroll();
        $scope.$apply();
    }

    function updateScroll(){
        var element = document.querySelector(".log");
        console.log(element.scrollTop)
        console.log(element.scrollHeight)
        element.scrollTop = element.scrollHeight;
    }

    function computerTurn() {
        log('It\'s the computer\'s turn!');
        setTimeout(() => {
            $scope.selectAttr('Height')
            $scope.$apply();
        }, 3000);
    }
});

app.directive('appCard', function() {
    return {
        templateUrl: 'card.html',
        scope: {
            pkmn: '=',
            reverse: '=',
            selectAttr: '=',
            interactable: '='
        }
    };
})
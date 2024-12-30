//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract RockPaperScissor {
    struct Game {
        address player1;
        address player2;
        uint8 player1Attack;
        uint8 player2Attack;
        address winner;
        bool status;
    }

    event GameReady(
        uint256 gameId,
        address player1,
        address player2,
        uint8 player1Attack,
        uint8 player2Attack
    );

    // Game name, symbol and owner
    string public name = "Rock Paper Scissor";
    string public symbol = "RPS";
    address public owner;

    // Game counter
    uint256 gameCount;
    // Mapping of game id to game
    uint256[] gameIds;
    mapping(uint256 => Game) games;

    function newGame(uint8 attack) external returns (uint256 gameId) {
        require(attack >= 1 && attack <= 3, "Invalid attack");
        gameId = gameCount++;
        Game storage game = games[gameId];
        game.player1 = msg.sender;
        game.player1Attack = attack;
        gameIds.push(gameId);
    }

    function joinGame(uint256 gameId, uint8 attack) external {
        require(attack >= 1 && attack <= 3, "Invalid attack");
        Game storage game = games[gameId];
        require(game.player1 != address(0), "Game does not exist");
        require(game.player2 == address(0), "Game is full");
        require(msg.sender != game.player1, "You are the creator of the game");
        game.player2 = msg.sender;
        game.player2Attack = attack;
        // DEBUG: Judge the game
        judge(gameId);
        emit GameReady(gameId, game.player1, game.player2, game.player1Attack, game.player2Attack);
    }

    function judge(uint256 gameId) public {
        Game storage game = games[gameId];
        require(game.player1 != address(0), "Game does not exist");
        require(game.player2 != address(0), "Game is not full");
        require(game.status == false, "Game is already judged");
        uint8 result = (game.player1Attack + 3 - game.player2Attack) % 3;
        if (result == 1) {
            game.winner = game.player1;
        } else if (result == 2) {
            game.winner = game.player2;
        }
        game.status = true;
    }

    function getGameIds() external view returns (uint256[] memory) {
        return gameIds;
    }

    function getGameData() internal view returns (Game[] memory) {
        Game[] memory _games = new Game[](gameIds.length);
        for (uint256 i = 0; i < gameIds.length; i++) {
            _games[i] = games[gameIds[i]];
        }
        return _games;
    }

    function getGames() external view returns (uint256[] memory, Game[] memory) {
        return (gameIds, getGameData());
    }
}
(function () {
    "use strict";

    var game = angular.module("minesweeper", ["ngRoute", "ngResource"]);

    game.config(function ($routeProvider) {
        $routeProvider
        .when("/", {
            templateUrl: "templates/game/board.html",
            controller: "gameController as ctrl"
        });
    });

    game.controller("gameController", function () {

        //# ViewModel ################################################################
        var self = this;

        self.game = {
            cheated: false,
            configuration: {
                totalRows: 8,
                totalColumns: 8,
                totalMines: 10,
            },
            board: {
                rows: [],
            },
            status: {
                finished: false,
                message: "",
            }
        };

        var messages = {
            win: { description: "You Win!", cssClass: "alert-success" },
            loose: { description: "You Loose!", cssClass: "alert-info" },
            gameOver: { description: "Game Over!", cssClass: "alert-danger" },
        }

        //# Interface Methods ################################################################

        self.newGame = function () {
            self.game.cheated = false;
            self.game.status.finished = false;
            self.game.status.message = "";

            setBoard();
        };

        self.cheatGame = function () {
            var arrFields = getArrayFieldsFlat();

            if (self.game.cheated) {
                arrFields.forEach(function (e) { e.mineCheated = false });
            } else {
                arrFields.forEach(function (e) { e.mineCheated = e.mined });
            }

            self.game.cheated = !self.game.cheated;
        };

        self.uncoverField = function (field) {
            if (!self.game.status.finished && field.discovered === false) {
                var totalMines = getTotalMinesAround(field);

                field.discovered = true;
                field.mineCheated = false;
                field.minesAround = (field.mined || totalMines == 0) ? "" : totalMines;

                updateGameStatus();
            }
        };

        self.validateGame = function () {

            if (self.game.status.finished) return;

            var arrFields = getArrayFieldsFlat();

            var allUncovered = arrFields.filter(function (e) { return e.mined === false; }).every(function (e) { return e.discovered });

            self.game.status.finished = true;
            self.game.status.message = (allUncovered) ? messages.win : messages.loose;

        };

        //# Functions ################################################################

        function getTotalMinesAround(field) {

            var totalMines = 0;
            var arrFields = getArrayFieldsFlat();

            var location = field.id.split('-');

            var rowIndex = eval(location[0]);
            var celIndex = eval(location[1]);

            for (var r = -1; r <= 1; r++) {
                for (var c = -1; c <= 1; c++) {
                    var id = (rowIndex + c) + "-" + (celIndex + r);

                    totalMines += arrFields.filter(function (e) { return (e.id == id) && e.mined }).length;
                    arrFields.filter(function (e) { return (e.id == id) && e.mined === false }).forEach(function (e) { e.discovered = true; });

                }
            }

            return totalMines;
        }

        function setBoard() {
            if (validateConfiguration()) {
                setBoardSize();
                setMines();
            }
        };

        function validateConfiguration() {
            var errorMessage = [];
            if (isNaN(self.game.configuration.totalColumns)) {
                errorMessage.push("Invalid Columns value");
            }

            if (isNaN(self.game.configuration.totalRows)) {
                errorMessage.push("Invalid Rows value");
            }

            if (isNaN(self.game.configuration.totalMines)) {
                errorMessage.push("Invalid Mines value");
            }

            if (self.game.configuration.totalColumns <= 0) {
                errorMessage.push("Columns is required");
            }

            if (self.game.configuration.totalRows <= 0) {
                errorMessage.push("Rows is required");
            }

            if (self.game.configuration.totalMines <= 0) {
                errorMessage.push("Mines is required");
            }

            if (self.game.configuration.totalMines > (self.game.configuration.totalColumns * self.game.configuration.totalRows)) {
                errorMessage.push("Invalid number of mines")
            }

            if (errorMessage.length > 0) {
                alert(errorMessage.join().replace(/,/g, '\n'));
                return false;
            } else {
                return true;
            }
        }

        function setBoardSize() {
            self.game.board.rows = [];

            for (var r = 0; r < self.game.configuration.totalRows; r++) {
                var row = {
                    fields: [],
                };

                for (var c = 0; c < self.game.configuration.totalColumns; c++) {
                    var field = {
                        id: r + "-" + c,
                        minesAround: "",
                        discovered: false,
                        mined: false,
                        mineCheated: false,
                    }

                    row.fields.push(field);
                };

                self.game.board.rows.push(row);
            };
        };

        function setMines() {
            for (var m = 0; m < self.game.configuration.totalMines; m++) {
                var minedField = findRandomField();
                minedField.mined = true;
            }
        };

        function findRandomField() {
            var idxRow = Math.round(Math.random() * self.game.configuration.totalRows);
            var idxField = Math.round(Math.random() * self.game.configuration.totalColumns);

            if (idxRow == self.game.configuration.totalRows) {
                idxRow--;
            }

            if (idxField == self.game.configuration.totalColumns) {
                idxField--;
            }

            var randomField = self.game.board.rows[idxRow].fields[idxField];

            if (randomField.mined) {
                return findRandomField();
            }

            return randomField;
        };

        function updateGameStatus() {

            var arrFields = getArrayFieldsFlat();

            var mineExploded = arrFields.some(function (e) { return (e.mined && e.discovered) });

            if (mineExploded) {
                self.game.status.finished = true;
                self.game.status.message = messages.gameOver;
            }
        };

        function getArrayFieldsFlat() {
            var arrFields = [].concat.apply([], self.game.board.rows.map(function (a) { return a.fields; }));

            return arrFields;
        }

        setBoard();
    });

})();
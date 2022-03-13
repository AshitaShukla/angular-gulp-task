/*global angular */

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the todoStorage service
 * - exposes the model to the template and provides event handlers
 */
angular = require('angular');

angular.module('todomvc')
	.controller('TodoCtrl', function TodoCtrl($scope, $routeParams, $filter, store) {
		'use strict';
		$scope.todos =  [
			{
			  "firstName": "Amit",
			  "lastName": "Roy",
			  "phone": "9876543210",
			  "id": 1
			},
			{
			  "firstName": "Aakash",
			  "lastName": "Choudhury",
			  "phone": "9876584431",
			  "id": 2
			},
			{
			  "firstName": "Arun",
			  "lastName": "Dey",
			  "phone": "5748493812",
			  "id": 3
			},
			{
			  "firstName": "Vikash",
			  "lastName": "Trivedi",
			  "phone": "9873625261",
			  "id": 4
			},
			{
			  "firstName": "Gaurav",
			  "lastName": "Gupta",
			  "phone": "7002873284",
			  "id": 5
			}
		  ];
			
		var todos  = store.todos = $scope.todos;
$scope.searchQuery="";
		$scope.newUser = {};
		$scope.editedTodo = null;
		$scope.phoneNumbr = /^\+?\d{2}[- ]?\d{3}[- ]?\d{5}$/;
		

		$scope.addTodo = function () {
			var newUser = {
				firstName: $scope.newUser.firstName.trim(),
				lastName:$scope.newUser.lastName.trim(),
				phone: $scope.newUser.phone,
				id: $scope.todos.length + 1

			};

			if (!newUser.firstName) {
				return;
			}

			store.insert(newUser);
			$scope.newUser = {};
		};

		$scope.editTodo = function (todo) {
			$scope.editedTodo = todo;
			// Clone the original todo to restore it on demand.
			$scope.originalTodo = angular.extend({}, todo);
		};

		$scope.saveEdits = function (todo, event) {
			// Blur events are automatically triggered after the form submit event.
			// This does some unfortunate logic handling to prevent saving twice.
			if (event === 'blur' && $scope.saveEvent === 'submit') {
				$scope.saveEvent = null;
				return;
			}

			$scope.saveEvent = event;

			if ($scope.reverted) {
				// Todo edits were reverted-- don't save.
				$scope.reverted = null;
				return;
			}

			todo.firstName = todo.firstName.trim();

			if (todo.firstName === $scope.originalTodo.firstName) {
				$scope.editedTodo = null;
				return;
			}

			store[todo.firstName ? 'put' : 'delete'](todo);
			$scope.editedTodo = null;
		};

		$scope.revertEdits = function (todo) {
			todos[todos.indexOf(todo)] = $scope.originalTodo;
			$scope.editedTodo = null;
			$scope.originalTodo = null;
			$scope.reverted = true;
		};

		$scope.removeTodo = function (todo) {
			store.delete(todo);
		};

		$scope.saveTodo = function (todo) {
			store.put(todo);
		};

		$scope.toggleCompleted = function (todo, completed) {
			if (angular.isDefined(completed)) {
				todo.completed = completed;
			}
			store.put(todo, todos.indexOf(todo));
		};

		$scope.clearCompletedTodos = function () {
			store.clearCompleted();
		};

		$scope.markAll = function (completed) {
			todos.forEach(function (todo) {
				if (todo.completed !== completed) {
					$scope.toggleCompleted(todo, completed);
				}
			});
		};
	});

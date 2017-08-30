angular
    .module('MainApp', [
        // Main Dependancies
        'ngAria',
        'ngMessages',
        'ngSanitize',
        'ngAnimate'
    ])
    .controller('loadData',function($scope, fileReader){

        $scope.from = {};
        $scope.file = null;
        $scope.text = null;

        $scope.setFile = function(e){
            console.log(e.files);
            $scope.file = e.files[0];
        };
        
        $scope.getTextFile = function () {
            console.log($scope.file)
            fileReader.readAsText($scope.file, $scope).then(function(result) {
                console.log('result',result);
              $scope.text = result;
            });
        };
    })
    // Onchange event or use directive
    .directive("readText", function() {
        return {
          link: function($scope,el) {
            el.bind("change", function(e) {
              $scope.file = (e.srcElement || e.target).files[0];
            });
          }
        };
    })
    .service("fileReader", function($q){
            
            function onLoad(reader, deferred, scope) {
                return function () {
                    scope.$apply(function () {
                        deferred.resolve(reader.result);
                    });
                };
            };
        
            function onError(reader, deferred, scope) {
                return function () {
                    scope.$apply(function () {
                        deferred.reject(reader.result);
                    });
                };
            };
        
            function getReader(deferred, scope) {
                let reader = new FileReader();
                reader.onload = onLoad(reader, deferred, scope);
                reader.onerror = onError(reader, deferred, scope);
                return reader;
            };
        
            function readAsText(file, scope) {
                let deferred = $q.defer();
            
                let reader = getReader(deferred, scope);         
                reader.readAsText(file);
                    
                return deferred.promise;
            };
        
            return {
                readAsText: readAsText 
            };
    });
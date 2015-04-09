//app.js

var app = {
    loadRequirements: 1,
    init: function () {
        document.addEventListener("deviceready", app.onDeviceReady);
        document.addEventListener("DOMContentLoaded", app.onDomReady);
    },
    onDeviceReady: function () {
        app.loadRequirements++;
        if (app.loadRequirements === 2) {
            app.start();
        }
    },
    onDomReady: function () {
        app.loadRequirements++;
        if (app.loadRequirements === 2) {
            app.start();
        }
    },
    start: function () {
        //connect to database
        //build the lists for the main pages based on data
        //add button and navigation listeners

        //db//

        var db = null;

        window.addEventListener("DOMContentLoaded", function () {
            checkDB();
            document.getElementById("btnAddPpl").addEventListener("click", addppl);
            document.getElementById("btnAddOcc").addEventListener("click", addocc);
            
            //PPLBACK
            document.getElementById("pplbackbtn").addEventListener("click", function(){
                  document.getElementById("people-list").style.display = "block";
                  document.getElementById("gifts-for-person").style.display = "none";
            });   
            //OCCBACK
              document.getElementById("occbackbtn").addEventListener("click", function(){
                  document.getElementById("occasion-list").style.display = "block";
                  document.getElementById("gifts-for-occasion").style.display = "none";
            });

            
            document.getElementById("mod1open").addEventListener("click", selectlistppl);
            document.getElementById("mod2open").addEventListener("click", selectlistocc);

            
            
        });

        function checkDB() {

            //app start once deviceready occurs
            console.info("deviceready");
            db = openDatabase('GiftDB', '', 'GiftrApp', 1024 * 1024);
            if (db.version == '') {
                console.info('First time running... create tables');
                //means first time creation of DB
                //increment the version and create the tables
                db.changeVersion('', '1.0',
                    function (trans) {
                        //something to do in addition to incrementing the value
                        //otherwise your new version will be an empty DB
                        console.log("DB version incremented");
                        //do the initial setup               



////PPL TABLE CREATE////////////////////////////////////////////////////////////////////////////////////////

                        trans.executeSql('CREATE TABLE people (person_id INTEGER PRIMARY KEY AUTOINCREMENT, person_name TEXT)', [],


                            function (tx, rs) {
                                //do something if it works
                                console.info("Table people created");
                            },
                            function (tx, err) {
                                //failed to run query
                                console.info(err.message);
                            });
                        trans.executeSql('INSERT INTO people (person_name) VALUES ("TEST")', [],
                            function (tx, rs) {
                                //do something if it works, as desired   
                                console.info("Added row in People");
                            },
                            function (tx, err) {
                                //failed to run query
                                console.info(err.message);
                            });

////OCC TABLE CREATE////////////////////////////////////////////////////////////////////////////////////////

                        trans.executeSql('CREATE TABLE occasions (occ_id INTEGER PRIMARY KEY AUTOINCREMENT, occ_name TEXT)', [],


                            function (tx, rs) {
                                //do something if it works
                                console.info("Table occasions created");
                            },
                            function (tx, err) {
                                //failed to run query
                                console.info(err.message);
                            });
                        trans.executeSql('INSERT INTO occasions (occ_name) VALUES ("TESTOCC")', [],
                            function (tx, rs) {
                                //do something if it works, as desired   
                                console.info("Added row in occasions");
                            },
                            function (tx, err) {
                                //failed to run query
                                console.info(err.message);
                            });

                    },
                    function (err) {
                        //error in changing version
                        //if the increment fails
                        console.info(err.message);
                    },
                    function () {
                        //successfully completed the transaction of incrementing the version number   
                    });
                addNavHandlers();
            } else {
                //version should be 1.0
                //this won't be the first time running the app
                console.info('Version: ', db.version)
                addNavHandlers();
            }
        }

        function addNavHandlers() {
            //get the lists of links and pages
            //add the tap/click events to the links
            //add the pageshow and pagehide events to the pages
            console.info("Adding nav handlers");
            //dispatch the click event on the first tab to make the home page load
            demoFunction();
        }

        //need to add occ part
        function demoFunction() {
            //just a function to show it in use.
            db.transaction(function (trans) {
                trans.executeSql('SELECT COUNT(*) AS cnt FROM people,occasions', [],
                    function (tx, rs) {
                        //success running the query
                        console.info("success getting number of rows");
                        //                        var output = document.querySelector("#output");
                        output.innerHTML = rs.rows.item(0).cnt;
                        console.info("number of items in people output");
                        console.log(rs.rows.item(0));
                    },



                    function (tx, err) {
                        //failed to run the query
                        console.info(err.message);
                    });
            }, transErr, transSuccess);
        }

        function transErr(tx, err) {
            //a generic function to run when any transaction fails
            //navigator.notification.alert(message, alertCallback, [title], [buttonName])
            console.info("Error processing transaction: " + err);
        }

        function transSuccess() {
            //a generic function to run when any transaction is completed
            //not something often done generically
        }






////LIST PPL////////////////////////////////////////////////////////////////////////////////////////


        function addppl(ev) {
            ev.preventDefault();
            var txtppl = document.getElementById("txtppl").value;
            if (txtppl != "") {
                //save the value in the stuff table
                db.transaction(function (trans) {
                        trans.executeSql('INSERT INTO people(person_name) VALUES(?)', [txtppl],
                            function (tx, rs) {
                                //do something if it works, as desired   
                                console.log("Added row in people");
                                updatePplList();
                            },
                            function (tx, err) {
                                //failed to run query
                                console.log(err.message);
                            });
                    },
                    function () {
                        //error for the transaction
                        console.log("The insert sql transaction failed.")
                    },
                    function () {
                        //success for the transation
                        //this function is optional
                    });
            } else {
                console.log("Text field is empty"); //can add output to html for it so appear on screen. can be good (change console.log to outpiut and make div in htmt)
            }
        }


////LIST OCC////////////////////////////////////////////////////////////////////////////////////////

        function addocc(ev) {
            ev.preventDefault();
            var txtocc = document.getElementById("txtocc").value;
            if (txtocc != "") {
                //save the value in the occ table
                db.transaction(function (trans) {
                        trans.executeSql('INSERT INTO occasions(occ_name) VALUES(?)', [txtocc],
                            function (tx, rs) {
                                //do something if it works, as desired   
                                console.log("Added row in occasions");
                                updateOccList();
                            },
                            function (tx, err) {
                                //failed to run query
                                console.log(err.message);
                            });
                    },
                    function () {
                        //error for the transaction
                        console.log("The insert sql transaction failed.")
                    },
                    function () {
                        //success for the transation
                        //this function is optional
                    });
            } else {
                console.log("Text field is empty"); //can add output to html for it so appear on screen. can be good (change console.log to outpiut and make div in htmt)
            }
        }


////LISTS////////////////////////////////////////////////////////////////////////////////////////
        
//PPL LIST//        
        function updatePplList() {
            var list = document.getElementById("listppl");
            list.innerHTML = "";
            //clear out the list before displaying everything
            db.transaction(function (trans) {


                trans.executeSql("SELECT * FROM people", [],
                    function (tx, rs) {
                        //success
                        //rs.rows.item(0).name would be the contents of the first row, name column
                        //rs.rows.length is the number of rows in the recordset
                        var numStuff = rs.rows.length;
                        for (var i = 0; i < numStuff; i++) {
                            var li = document.createElement("li");
                            li.innerHTML = rs.rows.item(i).person_name;
                            list.appendChild(li);
                        }
                        console.log("displayed the current contents of the ppl table")

                    },



                    function (tx, err) {
                        //error
                        console.log("transaction to list contents of ppl failed")
                    });
            });
        }
        
//OCC LIST//        

        function updateOccList() {
            var list = document.getElementById("listocc");
            list.innerHTML = "";
            //clear out the list before displaying everything
            db.transaction(function (trans) {


                trans.executeSql("SELECT * FROM occasions", [],
                    function (tx, rs) {
                        //success
                        //rs.rows.item(0).name would be the contents of the first row, name column
                        //rs.rows.length is the number of rows in the recordset
                        var numStuff = rs.rows.length;
                        for (var i = 0; i < numStuff; i++) {
                            var li = document.createElement("li");
                            li.innerHTML = rs.rows.item(i).occ_name;
                            list.appendChild(li);
                        }
                        console.log("displayed the current contents of the occ table")

                    },


                    function (tx, err) {
                        //error
                        console.log("transaction to list contents of occ failed")
                    });
            });
        }

/////LIST PPL SELECT/////////
        
         function selectlistppl() {
            var selectList = document.getElementById("pplGift");
            selectList.innerHTML = "";
            //clear out the list before displaying everything
            db.transaction(function (trans) {


                trans.executeSql("SELECT * FROM occasions", [],
                    function (tx, rs) {
                        //success
                        //rs.rows.item(0).name would be the contents of the first row, name column
                        //rs.rows.length is the number of rows in the recordset
                        var numStuff = rs.rows.length;
                        for (var i = 0; i < numStuff; i++) {
                            var li = document.createElement("option");
                            li.innerHTML = rs.rows.item(i).occ_name;
                            selectList.appendChild(li);
                        }
                        console.log("displayed the current contents of the ppl table")

                    },



                    function (tx, err) {
                        //error
                        console.log("transaction to list contents of ppl failed")
                    });
            });
        }
        

/////LIST OCC SELECT/////////
        
         function selectlistocc() {
            var selectList = document.getElementById("occGift");
            selectList.innerHTML = "";
            //clear out the list before displaying everything
            db.transaction(function (trans) {


                trans.executeSql("SELECT * FROM people", [],
                    function (tx, rs) {
                        //success
                        //rs.rows.item(0).name would be the contents of the first row, name column
                        //rs.rows.length is the number of rows in the recordset
                        var numStuff = rs.rows.length;
                        for (var i = 0; i < numStuff; i++) {
                            var li = document.createElement("option");
                            li.innerHTML = rs.rows.item(i).person_name;
                            selectList.appendChild(li);
                        }
                        console.log("displayed the current contents of the ppl table")

                    },



                    function (tx, err) {
                        //error
                        console.log("transaction to list contents of ppl failed")
                    });
            });
        }

//        
//
//        function updateOccList() {
//            var list = document.getElementById("listocc");
//            list.innerHTML = "";
//            //clear out the list before displaying everything
//            db.transaction(function (trans) {
//
//
//                trans.executeSql("SELECT * FROM occasions", [],
//                    function (tx, rs) {
//                        //success
//                        //rs.rows.item(0).name would be the contents of the first row, name column
//                        //rs.rows.length is the number of rows in the recordset
//                        var numStuff = rs.rows.length;
//                        for (var i = 0; i < numStuff; i++) {
//                            var li = document.createElement("li");
//                            li.innerHTML = rs.rows.item(i).occ_name;
//                            list.appendChild(li);
//                        }
//                        console.log("displayed the current contents of the occ table")
//
//                    },
//
//
//                    function (tx, err) {
//                        //error
//                        console.log("transaction to list contents of occ failed")
//                    });
//            });
//        }
        
        
////HAMMER/////////////////////////////////////////////////////////////////////////////////////////////////
        
        var hammertime = new Hammer(document.body, {});        
        var singleTap = new Hammer.Tap({
            event: 'tap'
        });        
        var doubleTap = new Hammer.Tap({
            event: 'doubletap',
            taps: 2
        });        
        hammertime.add([doubleTap, singleTap]);        
        doubleTap.requireFailure(singleTap);
                
        hammertime.on('tap', function (ev) {
//            document.getElementById("people-list").style.display = "none";
//            document.getElementById("gifts-for-person").style.display = "block";

            console.log("single");            
            console.log(ev);        
        });        
        hammertime.on('doubletap', function (ev) {            
            console.log("double");            
            console.log(ev);        
        });



        var hammertimes = new Hammer(document.body, {});       
        hammertimes.on('swipeleft', function (ev) {            
            document.getElementById("occasion-list").style.display = "none";            
            document.getElementById("people-list").style.display = "block";
            //            console.log("swipeleft");            
            //            console.log(ev);

        });        
        hammertimes.on('swiperight', function (ev) {            
            document.getElementById("occasion-list").style.display = "block";            
            document.getElementById("people-list").style.display = "none";
            //            console.log("swiperight");            
            //            console.log(ev);

                    
        });
        
        var ul = document.getElementById("listppl");
        var hammertime = new Hammer(ul);
        var singleTap = new Hammer.Tap({event: 'tap'});
        var doubleTap = new Hammer.Tap({event: 'doubletap', taps: 2});
        hammertime.add([doubleTap, singleTap]);
        doubleTap.requireFailure(singleTap);

        hammertime.on('tap', function(ev) {
            document.getElementById("people-list").style.display = "none";
            document.getElementById("gifts-for-person").style.display = "block";
        });
        
        var ul = document.getElementById("listocc");
        var hammertime = new Hammer(ul);
        var singleTap = new Hammer.Tap({event: 'tap'});
        var doubleTap = new Hammer.Tap({event: 'doubletap', taps: 2});
        hammertime.add([doubleTap, singleTap]);
        doubleTap.requireFailure(singleTap);

        hammertime.on('tap', function(ev) {
            document.getElementById("occasion-list").style.display = "none";
            document.getElementById("gifts-for-occasion").style.display = "block";
        });



    }
}







////DIV NAV////////////////////////////////////////////////////////////////////////////////////////

// show one div at a time
function show(elementID) {
    // try to find the requested page and alert if it's not found
    var ele = document.getElementById(elementID);
    if (!ele) {
        alert("no such element");
        return;
    }

    // get all pages, loop through them and hide them
    var pages = document.getElementsByClassName('page');
    for (var i = 0; i < pages.length; i++) {
        pages[i].style.display = 'none';
    }

    // then show the requested page
    ele.style.display = 'block';
}









app.init();
/* Javascript for CLOVERVLABXBlock. */
function CLOVERVLABXBlock(runtime, element) {

    function loading() {
        $(".ImageNotcreated,.VMnotcreated,.VMcreated", element).hide();
        $(".loading", element).show();
        $(".iframeGuacamole", element).width(0);
        $(".iframeGuacamole", element).height(0);
        $('.iframeGuacamole,.closeiframeGuacamole', element).css('opacity', '0');
        $('.closeiframeGuacamole', element).hide();
        $(".iframeGuacamole").attr("src", "");
    }

    function VMactive() {
        $(".ImageNotcreated,.VMnotcreated,.buttondemarrerVM,.loading", element).hide();
        $(".VMcreated,.test,.buttonStopVM", element).show();
        $(".blockViewVm", element).css("opacity", "1");
        $(".blockViewVm", element).css("pointer-events", "auto");
        $("#StatusMachine", element).text(" The virtual Desktop is ready");
    }

    function VMstopped() {
        $(".ImageNotcreated,.VMnotcreated,.loading,.buttonStopVM", element).hide();
        $(".VMcreated,.test,.buttondemarrerVM", element).show();
        $(".blockViewVm", element).css("opacity", "0.5");
        $(".blockViewVm", element).css("pointer-events", "none");
        $("#StatusMachine", element).text(" The virtual desktop is stopped");
    }

    function VMnotCreated() {
        $(".ImageNotcreated,.loading,.VMcreated", element).hide();
        $(".VMnotcreated", element).show();
        $("#StatusMachine", element).text(" The virtual desktop is not created");
    }

    function ImagenotCreated() {
        $(".ImageNotcreated", element).show();
        $(".VMnotcreated,.loading,.VMcreated", element).hide();
        $("#StatusMachine", element).text(" The image is not created");
    }

    function GetVMStatus() {
        var intervalId = setInterval(function() {
            var handlerGetVMStatus = runtime.handlerUrl(element, 'GetVMStatus');
            $.post(handlerGetVMStatus, JSON.stringify({})).done(function(response) {
                if (response.status === 'ok') {
                    if (response.VMStatus === "active") {
                        clearInterval(intervalId);
                        VMactive();
                    } else if (response.VMStatus === "stopped") {
                        clearInterval(intervalId);
                        VMstopped();
                    } else if (response.VMStatus === "notCreated") {
                        clearInterval(intervalId);
                        VMnotCreated();
                    }
                } else {
                    if (response.reason === "VM not created") {
                        clearInterval(intervalId);
                        VMnotCreated();
                    }
                    runtime.notify('error', {
                        msg: response.reason
                    })
                }
            })
        }, 10000);
    }

    function OpenXblock() {
        var handlerGetImageStatus = runtime.handlerUrl(element, 'GetImageStatus');
        $.post(handlerGetImageStatus, JSON.stringify({})).done(function(response) {
            if ((response.status === 'ok') && (response.userStatus === 'notAuthorized')) {
                ImagenotCreated();
                console.log("You are not authorized to use CloVER, please contact your CloVER administrator");
            } else if (response.status === 'ok') {
                if (response.imageStatus === 'active') {
                    var handlerGetVMStatus = runtime.handlerUrl(element, 'GetVMStatus');
                    $.post(handlerGetVMStatus, JSON.stringify({})).done(function(response) {
                        if (response.status === 'ok') {
                            if (response.VMStatus === "encours") {
                                $("#StatusMachine", element).text(" Please wait your Desktop is still loading");
                                GetVMStatus()
                            } else if (response.VMStatus === "active") {
                                VMactive();
                            } else if (response.VMStatus === "stopped") {
                                VMstopped();
                            } else if (response.VMStatus === "notCreated") {
                                VMnotCreated();
                            }
                        } else {
                            if (response.reason === "VM not created") {
                                VMnotCreated();
                            } else if (response.status === 'error') {
                                $.alert(response.reason);
                                console.log(response.reason);
                            }
                        }
                    })
                } else if ((response.imageStatus === 'notCreated') || (response.imageStatus === 'waitingForConfirmation') || (response.imageStatus === 'loading')) {
                    ImagenotCreated();
                }
            } else if (response.status === 'error') {
                $.alert("There is an error, Please try again later.");
                console.log(response.reason);
            }
        });
    }

    //close iframe
    $(element).find('.buttonCloseFrameGuacamole').bind('click', function() {
        $(".iframeGuacamole", element).attr("src", "");
        $(".iframeGuacamole", element).width(0);
        $(".iframeGuacamole ", element).height(0);
        $('.iframeGuacamole,.closeiframeGuacamole', element).css('opacity', '0');
        $(' .closeiframeGuacamole', element).hide();
    });

    //refresh
    $('.refresh', element).bind('click', function() {
        loading();
        OpenXblock();
    });

    // Stop VM
    $('.buttonStopVM', element).confirm({
        title: $("#Name_VM").val(),
        content: 'Are you sure you want to stop this VM ?',
        buttons: {
            confirm: function() {
                loading();
                var handlerStopVM = runtime.handlerUrl(element, 'Stop_VM');
                $.post(handlerStopVM, JSON.stringify({})).done(function(response) {
                    if (response.status === 'ok') {
                        $("#StatusMachine", element).text(" Please wait your Desktop is still loading");
                        GetVMStatus()
                    } else if ((response.status === 'error') || (response.status === 'notAuthorized')) {
                        $.alert("There is an error, Please try again later.");
                        console.log(response.reason);
                    }
                });
            },
            cancel: function() {
            }
        }
    });

    // demarrer VM
    $('.buttondemarrerVM', element).confirm({
        title: $("#Name_VM").val(),
        content: 'Are you sure you want to start this VM ?',
        buttons: {
            confirm: function() {
                loading();
                var handlerdemarrerVM = runtime.handlerUrl(element, 'StartVm');
                $.post(handlerdemarrerVM, JSON.stringify({})).done(function(response) {
                    if (response.status === 'ok') {
                        $("#StatusMachine", element).text(" Please wait your Desktop is still loading");
                        GetVMStatus()
                    } else if ((response.status === 'error') || (response.status === 'notAuthorized')) {
                        $.alert("There is an error, Please try again later.");
                        console.log(response.reason);
                    }
                });
            },
            cancel: function() {}
        }
    });

    // delete VM
    $('.buttonDeleteVM', element).confirm({
        title: $("#Name_VM").val(),
        content: 'Are you sure you want to delete this VM ?',
        buttons: {
            confirm: function() {
                loading();
                var handlerdeleteVM = runtime.handlerUrl(element, 'deleteVM');
                $.post(handlerdeleteVM, JSON.stringify({})).done(function(response) {
                    if (response.status === 'ok') {
                        $("#StatusMachine", element).text(" Please wait your Desktop is still loading");
                        GetVMStatus()
                    } else if ((response.status === 'error') || (response.status === 'notAuthorized')) {
                        $.alert("There is an error, Please try again later.");
                        console.log(response.reason);
                    }
                });
            },
            cancel: function() {}
        }
    });

    //RebootVM
    $('.buttonRebootVM', element).confirm({
        title: $("#Name_VM").val(),
        content: 'Are you sure you want to restart this VM ?',
        buttons: {
            confirm: function() {
                loading();
                var handlerRebootVM = runtime.handlerUrl(element, 'RebootVM');
                $.post(handlerRebootVM, JSON.stringify({})).done(function(response) {
                    if (response.status === 'ok') {
                        $("#StatusMachine", element).text(" Please wait your Desktop is still loading");
                        GetVMStatus()
                    } else if ((response.status === 'error') || (response.status === 'notAuthorized')) {
                        $.alert("There is an error, Please try again later.");
                        console.log(response.reason);
                    }
                });
            },
            cancel: function() {
            }
        }
    });

    //ViewDesktop
    $('.ViewDesktop', element).bind('click', function() {
        $(".iframeGuacamole").attr("src", "");
        $(".ViewDesktop > img", element).attr('src', 'https://procan-group.com/imgXblock/colorful-loader-gif-transparent-11.gif');
        $(".iframeGuacamole").width(0);
        $(".iframeGuacamole").height(0);
        $('.iframeGuacamole,.closeiframeGuacamole').css('opacity', '0');
        $('.closeiframeGuacamole').hide();
        var handlerViewGuacamole = runtime.handlerUrl(element, 'ViewGuacamole');
        $.post(handlerViewGuacamole, JSON.stringify({})).done(function(response) {
            $(".ViewDesktop > img", element).attr('src', 'https://procan-group.com/imgXblock/window-icon.png');
            if (response.status === 'ok') {
                $("iframe").removeAttr("name");
                $('.iframeGuacamole', element).attr("name", "iframeGuacamole");
                urlPost = response.ipg + "/guacamole/login.jsp";
                $(".iframeGuacamole", element).width(750);
                $(".iframeGuacamole", element).height(600);
                $('.iframeGuacamole,.closeiframeGuacamole', element).css('opacity', '1');
                $('.closeiframeGuacamole', element).show();
                console.log(urlPost + '?username=' + response.id_user + '-' + response.id_service + '&password=' + response.id_service + '-' + response.id_user + '-' + response.id_service);
                var form = $('<form action="' + urlPost + '" method="post" target="iframeGuacamole" >' +
                    '<input type="hidden" name="username" value="' + response.id_user + '-' + response.id_service + '"></input>' +
                    '<input type="hidden" name="password" value="' + response.id_service + '-' + response.id_user + '-' + response.id_service + '"></input>' + '</form>');
                console.log(form);
                $('#form', element).append(form);
                $(form, element).submit();


                var iframeFOC = $(".iframeGuacamole", element)[0];
                iframeFOC.contentWindow.focus();

            } else if ((response.status === 'error') || (response.status === 'notAuthorized')) {
                $.alert("There is an error, Please try again later.");
                console.log(response.reason);
            }
        });
    });

    //ViewGuacamole
    $('#ViewGuacamole', element).bind('click', function() {
        $(".iframeGuacamole").attr("src", "");
        $(".iframeGuacamole").width(0);
        $(".iframeGuacamole").height(0);
        $('.iframeGuacamole,.closeiframeGuacamole').css('opacity', '0');
        $('.closeiframeGuacamole').hide();
        $("#ViewGuacamole > img", element).attr('src', 'https://procan-group.com/imgXblock/colorful-loader-gif-transparent-11.gif');
        var handlerViewGuacamole = runtime.handlerUrl(element, 'ViewGuacamole');
        $.post(handlerViewGuacamole, JSON.stringify({})).done(function(response) {
            $("#ViewGuacamole > img", element).attr('src', 'https://procan-group.com/imgXblock/display-icon.png');
            if (response.status === 'ok') {
                urlPost = response.ipg + "/guacamole/login.jsp";
                var form = $('<form action="' + urlPost + '" method="post" target="_blank">' +
                    '<input type="hidden" name="username" value="' + response.id_user + '-' + response.id_service + '"></input>' +
                    '<input type="hidden" name="password" value="' + response.id_service + '-' + response.id_user + '-' + response.id_service + '"></input>' + '</form>');
                console.log(form);
                $('#form', element).append(form);
                $(form, element).submit();
            } else if ((response.status === 'error') || (response.status === 'notAuthorized')) {
                $.alert("There is an error, Please try again later.");
                console.log(response.reason);
            }
        });
    });

    // create VM
    $('.createVM', element).confirm({
        title: $("#Name_VM").val(),
        content: 'Are you sure you want to create this VM ?',
        buttons: {
            confirm: function() {
                loading();
                var handlercreateVM = runtime.handlerUrl(element, 'Create_VM');
                $.post(handlercreateVM, JSON.stringify({})).done(function(response) {
                    if (response.status === 'ok') {
                        $("#StatusMachine", element).text(" Please wait your Desktop is still loading");
                        GetVMStatus()
                    } else if ((response.status === 'error') || (response.status === 'notAuthorized')) {
                        $.alert("There is an error, Please try again later.");
                        console.log(response.reason);
                    }
                });
            },
            cancel: function() {
            }
        }
    });

    loading();
    OpenXblock();
}

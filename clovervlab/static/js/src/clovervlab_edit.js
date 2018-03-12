/* Javascript for clovervlabXBlock. */
function clovervlabXBlockInitEdit(runtime, element) {

    //declartion varible image
    var image_name = "";
    var ImageOS = "";
    var ImageFlavor = "";

    $('<ul class="editor-modes action-list action-modes"><li class="action-item" data-mode="editor"><a href="#" class="editor-image-button editor-button is-set">Vlab configuration</a></li><li class="action-item" data-mode="settings"><a href="#" class="settings-button">Settings</a></li></ul>').insertAfter("#modal-window-title");

    $("#wizard").steps({
        headerTag: "h2",
        bodyTag: "section",
        transitionEffect: "slideLeft",
        enableFinishButton: false,
        enablePagination: false,
        titleTemplate: "#title#",
    });

    $(document).ready(function() {
        $('input[name=type_create_image]').live('change', function() {
            selected_value = $("input[name='type_create_image']:checked").val()
            if (selected_value === 'existing') {
                $(element).find('#new-image').css('display', 'none');
                $(element).find('#existingimage').css('display', 'block');
            } else if (selected_value === 'newimage') {
                $(element).find('#new-image').css('display', 'block');
                $(element).find('#existingimage').css('display', 'none');
            }
        });
    });

    if ($(element).find("#statusauth").val() == "") {
        $(element).find(".loginhtml").show();
        $(element).find(".logouthtml").hide();
    } else {
        $(element).find(".loginhtml").hide();
        $(element).find(".logouthtml").show();
    }

    $('.editor-image-button').bind('click', function() {
        debut();
    });

    $('.settings-button').bind('click', function() {
        $("#SingleContainer-tab ,#scenario-tab ,#auth-tab ,#loading-tab").removeClass("is-active");
        $("#settings-tab").addClass("is-active");
    });

    //edit dns clover - display name
    $('.setting-edit-dns').bind('click', function() {
        $("#vlab_edit_DNS").removeAttr('readonly');
        $(element).find('#vlab_edit_DNS').css('background', '');
    });

    $('.setting-edit-DisplayName').bind('click', function() {
        $("#vlab_edit_display_name").removeAttr('readonly');
        $(element).find('#vlab_edit_display_name').css('background', '');
    });

    $('.scenario_Vblab').bind('click', function() {
        if ($('input[name=creative-commons-NC]:checked').val() == 1) {
            $("#scenario-tab ,#settings-tab ,#auth-tab").removeClass("is-active");
            $("#SingleContainer-tab").addClass("is-active");
            InterfaceSingleVM();
        } else if ($('input[name=creative-commons-NC]:checked').val() == 2) {
            alert("Being Created");
        } else {
            alert("Please select an option");
        }

    });

    //change display name
    $('#DisplayName').bind('click', function() {
        runtime.notify('save', {
            state: 'start'
        });
        var handlerchange_display_name = runtime.handlerUrl(element, 'change_display_name');
        var data = {
            'display_name': $(element).find('#vlab_edit_display_name').val(),
            'DNS': $(element).find('#vlab_edit_DNS').val(),
        };
        $.post(handlerchange_display_name, JSON.stringify(data)).done(function(response) {
            if (response.status === 'ok') {
                runtime.notify('save', {
                    state: 'end'
                });
            } else {
                runtime.notify('error', {
                    msg: response.message
                })
            }
        });
    })

    //log in
    $(element).find('.login').bind('click', function() {
        $(element).find("#error_auth").empty();
        var handlerauthlogin = runtime.handlerUrl(element, 'funLoginClover');
        var data = {
            'UrlClover': $(element).find('#URLClover').val(),
            'Login': $(element).find('#LoginClover').val(),
            'Password': $(element).find('#PwdClover').val(),
        };
        $.post(handlerauthlogin, JSON.stringify(data)).done(function(response) {
            if (response.status === 'ok') {
                $(element).find(".logouthtml").show();
                debut();
            } else {
                $(element).find("#error_auth").append("<p style='color: red;'>" + response.reason + "</p>");
            }
        });
    })

    //log out
    $(element).find('.logout').bind('click', function() {
        var handlerauthlogout = runtime.handlerUrl(element, 'funLogoutClover');
        var data = {};
        $.post(handlerauthlogout, JSON.stringify(data)).done(function(response) {
            if (response.status === 'ok') {
                runtime.notify('cancel', {});
            } else {
                runtime.notify('error', {
                    msg: response.message
                })
            }
        });
    })

    function debut() {
        $("#SingleContainer-tab ,#settings-tab ,#auth-tab ,#scenario-tab").removeClass("is-active");
        $("#loading-tab").addClass("is-active");
        loading();
        InterfaceScenario();
    }

    function loading() {
        $(element).find('.form-style-10').css('background-image', 'url(https://procan-group.com/imgXblock/please-wait.gif)');
        $(element).find(".form-style-10").css("background-repeat", "no-repeat");
        $(element).find(".form-style-10").css("background-position", "center");
        $(element).find(".createimage, .Confirmeimage, .ImageActive").hide();
        $(element).find("#wizard").hide();
    }

    function LoadingFewMinutes() {
        $(element).find('.form-style-10').append("<li style='font-size: 150%;' class='PleaseWait'><br><center><h2>This may take some time. Please wait.</h2></center></li>");
        $(element).find('.form-style-10').css('background-image', 'url(https://procan-group.com/imgXblock/please-wait.gif)');
        $(element).find(".form-style-10").css("background-repeat", "no-repeat");
        $(element).find(".form-style-10").css("background-position", "center");
        $(element).find(".createimage, .Confirmeimage, .ImageActive").hide();
        $(element).find("#wizard").hide();
    }

    function PagenotCreated() {
        $("#wizard-t-0").parent().removeClass("disabled");
        $(element).find('.wizard > .content').css('min-height', '31em');
        document.getElementById('wizard-t-0').click();
        $("#wizard-t-2").parent().removeClass("first done");
        $("#wizard-t-2 , #wizard-t-1").parent().removeClass("done");
        $("#wizard-t-2 , #wizard-t-1").parent().addClass("disabled");
        $(element).find(".createimage , #wizard").css("opacity", "1");
        $(element).find(".createimage, createimage").css("pointer-events", "auto");
        $(element).find('.PleaseWait').remove();
        var handlerFlavorsImage = runtime.handlerUrl(element, 'FlavorsImage');
        $.post(handlerFlavorsImage, JSON.stringify({})).done(function(response) {
            if (response.status === 'ok') {
                $(element).find("#selectflavors, #selectimage, #ListNotBaseimage").html("");
                $(element).find("#selectflavors").append(response.flavors);
                $(element).find("#selectimage").append(response.image);
                $(element).find("#ListNotBaseimage").append(response.imageexisting);
                $(element).find(".createimage, #wizard").delay('10000').show();
                $(element).find('.form-style-10').css("background-image", "");
                $(element).find('.PleaseWait').remove();
                $('#List_Flavors').on('change', function() {
                    var selected = $(this).find('option:selected');
                    var strflavor = "VCPUS: " + selected.data('vcpus') + " - RAM: " + selected.data('ram') + "Mo - Total Disk: " + selected.data('dis') + "Go - " + selected.data('os');
                    $(element).find('.disflavor').html(strflavor);
                    $(element).find('#RAM').html(selected.data('ram'));
                    $(element).find('#CPU').html(selected.data('vcpus'));
                    $(element).find('#DIS').html(selected.data('dis'));
                    $(element).find('#OS').html(selected.data('os'));
                });
            } else if ((response.status === 'error') || (response.status === 'notAuthorized')) {
                runtime.notify('error', {
                    title: 'Error',
                    message: response.reason,
                    state: 'start'
                });
                setTimeout(function() {
                    runtime.notify('cancel', {})
                }, 10000);
            }
        })
    }

    function PageConfirmeImage() {
        $(element).find('.wizard > .content').css('min-height', '41em');
        $("#wizard-t-1").parent().removeClass("disabled");
        document.getElementById('wizard-t-1').click();
        $(element).find(".Confirmeimage, #wizard").css("opacity", "1");
        $(element).find(".Confirmeimage, #wizard").css("pointer-events", "auto");
        $(element).find("#wizard-t-0").parent().addClass("done disabled");
        $(element).find(".buttonConfirmeimage").delay('10000').show();
        $(element).find(".Confirmeimage, #wizard").delay('10000').show();
        $(element).find('.form-style-10').css("background-image", "");
        $(element).find('.PleaseWait').remove();
        if ((image_name != "") && (ImageOS != "")) {
            $(element).find('.imagename').text(image_name);
            $(element).find('.ImageOS').text(ImageOS);
            $(element).find('.ImageFlavor').text(ImageFlavor);
        }
        document.getElementById('wizard-t-1').click();
        var handlerGetSnapshot = runtime.handlerUrl(element, 'GetSnapshot');
        $.post(handlerGetSnapshot, JSON.stringify({})).done(function(response) {
            if (response.status === 'ok') {
                console.log("VM info : </br>" + response.user + "  password: " + response.pwd + "   address: " + response.ip);
                $(element).find("#ip").val(response.ip);
                $(element).find("#usr").val(response.user);
                $(element).find("#pwd").val(response.pwd);
            } else if ((response.status === 'error') || (response.status === 'notAuthorized')) {
                console.log(response.reason);
            }
        });
    }

    function PageImageActive() {
        $(element).find('.wizard > .content').css('min-height', '23em');
        $("#wizard-t-2").parent().removeClass("disabled");
        document.getElementById('wizard-t-2').click();
        $("#wizard-t-0, #wizard-t-1").parent().removeClass("first");
        $("#wizard-t-0, #wizard-t-1").parent().removeClass("done");
        $("#wizard-t-0, #wizard-t-1").parent().addClass(" done disabled");
        $(element).find(".ImageActive, #wizard").css("opacity", "1");
        $(element).find(".ImageActive , #wizard").css("pointer-events", "auto");
        $(element).find(".ImageActive, #wizard").delay('10000').show();
        $(element).find('.form-style-10').css("background-image", "");
        $(element).find('.PleaseWait').remove();
        if ((image_name != "") && (ImageOS != "")) {
            $(element).find('.imagename').text(image_name);
            $(element).find('.ImageOS').text(ImageOS);
            $(element).find('.ImageFlavor').text(ImageFlavor);
        }
        document.getElementById('wizard-t-2').click();
    }
    $(element).find("#showinfoV").click(function() {
        alert('Rdp Access information \n \n IP address:' + $(element).find("#ip").val() + '\n \n Login: ' + $(element).find("#usr").val() + '\n \n Password: ' + $(element).find("#pwd").val());
    })

    function getStatusImage() {
        var handlerGetImageStatus = runtime.handlerUrl(element, 'GetImageStatus');
        var intervalId = setInterval(function() {
            $.post(handlerGetImageStatus, JSON.stringify({})).done(function(response) {
                if (response.status === 'ok') {
                    if (response.imageStatus === 'waitingForConfirmation') {
                        clearInterval(intervalId);
                        PageConfirmeImage()
                    }
                    if (response.imageStatus === 'active') {
                        clearInterval(intervalId);
                        PageImageActive()
                    }
                    if (response.imageStatus === 'notCreated') {
                        clearInterval(intervalId);
                        PagenotCreated()
                    }
                } else if (response.status === 'error') {
                    runtime.notify('error', {
                        title: 'Title',
                        message: response.reason,
                        state: 'start'
                    });
                    setTimeout(function() {
                        runtime.notify('cancel', {})
                    }, 10000);
                }
            });
        }, 10000);
    }

    function InterfaceScenario() {
        var handlerVLABscenario = runtime.handlerUrl(element, 'GetStatusInitial');
        $.post(handlerVLABscenario, JSON.stringify({})).done(function(response) {
            if (response.userStatus === "Authorized") {
                if (response.imageStatus === "notCreated") {
                    $("#loading-tab, #settings-tab, #auth-tab, #SingleContainer-tab").removeClass("is-active");
                    $("#scenario-tab").addClass("is-active");
                } else {
                    $("#loading-tab,#scenario-tab,#settings-tab,#auth-tab").removeClass("is-active");
                    $("#SingleContainer-tab").addClass("is-active");
                    InterfaceSingleVM();
                }
            } else { //auth-tab
                $("#loading-tab,#scenario-tab, #settings-tab, #auth-tab, #SingleContainer-tab").removeClass("is-active");
                $("#auth-tab").addClass("is-active");
            }
        });
    }

    function InterfaceSingleVM() {
        //page create image
        $(element).find('.required1,.required2,.required3,.required4').hide();
        var handlerGetImageStatus = runtime.handlerUrl(element, 'GetImageStatus');
        $.post(handlerGetImageStatus, JSON.stringify({})).done(function(response) {
            if (response.status === 'ok') {
                if (response.imageStatus === "notCreated") {
                    PagenotCreated();
                } else if (response.imageStatus === 'loading') {
                    loading();
                    getStatusImage();
                } else if (response.imageStatus === 'waitingForConfirmation') {
                    PageConfirmeImage()
                } else if (response.imageStatus === 'active') {
                    PageImageActive()
                }
            } else if (response.status === 'error') {
                runtime.notify('error', {
                    title: 'Error',
                    message: response.reason,
                    state: 'start'
                });
                setTimeout(function() {
                    runtime.notify('cancel', {})
                }, 10000);
            }
        });
    }

    //button create image
    $(element).find('.buttoncreateimage').bind('click', function() {
        $(element).find('.required1,.required2,.required3,.required4').hide();
        re = /^[a-zA-Z0-9-\s]*$/; //avec espace et slash
        if ((!re.test($(element).find('#image_name').val())) || ($(element).find('#image_name').val() === "")) {
            $(element).find('.required1').show();
            return false;
        } else if (($(element).find('#List_Image option:selected').val() === "") && ($(element).find('#new-image').css('display') == 'block')) {
            $(element).find('.required2').show();
            return false;
        } else if (($(element).find('#List_Flavors option:selected').val() === "") && ($(element).find('#new-image').css('display') == 'block')) {
            $(element).find('.required3').show();
            return false;
        } else if (($(element).find('#List_ListNotBase option:selected').val() === "") && ($(element).find('#existingimage').css('display') == 'block')) {
            $(element).find('.required4').show();
            return false;
        } else {
            $.confirm({
                title: "",
                content: 'Are you sure you want to create this image ?',
                onOpenBefore: function() {
                    // before the modal is displayed.
                    console.log('onOpenBefore');
                },
                buttons: {
                    confirm: function() {
                        LoadingFewMinutes();
                        if ($(element).find('#new-image').css('display') == 'block') {
                            var data = {
                                'image_name': $(element).find('#image_name').val(),
                                'description': $(element).find('#Image_Description').val(),
                                'flavors': $(element).find('#List_Flavors').val(),
                                'image': $(element).find('#List_Image').val(),
                                'flavorsText': $(element).find('#List_Flavors option:selected').text(),
                                'imageText': $(element).find('#List_Image option:selected').text(),
                            };
                            var handlercreate_image = runtime.handlerUrl(element, 'create_image');
                        } else if ($(element).find('#existingimage').css('display') == 'block') {
                            var data = {
                                'image_name': $(element).find('#image_name').val(),
                                'description': $(element).find('#Image_Description').val(),
                                'id_ancien_snap': $(element).find('#List_ListNotBase').val(),
                                'id_ancien_snapText': $(element).find('#List_ListNotBase option:selected').text(),
                            };
                            var handlercreate_image = runtime.handlerUrl(element, 'create_ImageDirect');
                        }
                        $.post(handlercreate_image, JSON.stringify(data)).done(function(response) {
                            if (response.status === 'ok') {
                                //declartion varible image
                                image_name = $(element).find('#image_name').val();
                                ImageOS = $(element).find('#List_Image option:selected').text();
                                ImageFlavor = $(element).find('#List_Flavors option:selected').text();
                                getStatusImage();
                            } else if ((response.status === 'error') || (response.status === 'notAuthorized')) {
                                runtime.notify('error', {
                                    title: 'Error',
                                    message: response.reason,
                                    state: 'start'
                                });
                                setTimeout(function() {
                                    runtime.notify('cancel', {})
                                }, 10000);
                            }
                        });
                    },
                    cancel: function() {}
                }
            })
        }
    });

    //confirme create image
    $(element).find('.buttonConfirmeimage').confirm({
        title: '',
        content: 'Are you sure you want to confirm this image ?',
        buttons: {
            confirm: function() {
                LoadingFewMinutes();
                var handlerConfirm_image = runtime.handlerUrl(element, 'Confirm_image');
                $.post(handlerConfirm_image, JSON.stringify({})).done(function(response) {
                    if (response.status === 'ok') {
                        getStatusImage();
                    } else if ((response.status === 'error') || (response.status === 'notAuthorized')) {
                        runtime.notify('error', {
                            title: 'Error',
                            message: response.reason,
                            state: 'start'
                        });
                        setTimeout(function() {
                            runtime.notify('cancel', {})
                        }, 10000);
                    }
                });
            },
            cancel: function() {}
        }
    });

    //Delete image
    $(element).find('.buttonDeleteimage').confirm({
        title: "",
        content: 'Are you sure you want to delete this image ?',
        buttons: {
            confirm: function() {
                LoadingFewMinutes();
                var handlerDelete_Image = runtime.handlerUrl(element, 'Delete_Image');
                $.post(handlerDelete_Image, JSON.stringify({})).done(function(response) {
                    if (response.status === 'ok') {
                        if (response.imageDeleted === 'yes') {
                            PagenotCreated();
                        }
                    } else if ((response.status === 'error') || (response.status === 'notAuthorized')) {
                        runtime.notify('error', {
                            title: 'Error',
                            message: response.reason,
                            state: 'start'
                        });
                        setTimeout(function() {
                            runtime.notify('cancel', {})
                        }, 10000);
                    }
                });
            },
            exit: function() {
                runtime.notify('cancel', {});
            }
        }
    });
    
    //cancel Xblock
    $(element).find('.action-cancel').bind('click', function() {
        runtime.notify('cancel', {});
    });

    //close iframe
    $(element).find('.buttonCloseFrameGuacamole').bind('click', function() {
        $(element).find(".iframeGuacamoleSnap").attr("src", "");
        $(element).find('.inner-wrap_confirme').show();
        $(element).find('.inner-wrap_iframe').css("display", "none");
        $(element).find('.wizard > .content').css('min-height', '41em');
        $(element).find('.wizard > .content').css('min-width', '37.500em');
        $(".iframeGuacamoleSnap", element).width(0);
        $(".iframeGuacamoleSnap", element).height(0);
        $('.iframeGuacamoleSnap, .closeiframeGuacamole', element).css('opacity', '0');
    });

    //ViewGuacamoleiframe
    $(element).find('#ViewFrameGuacamole').bind('click', function() {
        $(element).find(".iframeGuacamoleSnap").attr("src", "");
        $(element).find('.inner-wrap_confirme').hide();
        $(element).find('.inner-wrap_iframe').css("display", "block");
        $(element).find('.wizard > .content').css('min-height', '55em');
        $(element).find('.wizard > .content').css('min-width', '62.500em');
        $("#ViewFrameGuacamole > img").attr('src', 'https://procan-group.com/imgXblock/please-wait.gif');
        $('.iframeGuacamoleSnap', element).attr("src", "https://procan-group.com/imgXblock/please-wait.gif");
        $(".iframeGuacamoleSnap", element).width(300);
        $(".iframeGuacamoleSnap", element).height(700);
        $('.iframeGuacamoleSnap, .closeiframeGuacamole', element).css('opacity', '1');
        var handlerViewGuacamoleSnap = runtime.handlerUrl(element, 'ViewGuacamoleSnap');
        $.post(handlerViewGuacamoleSnap, JSON.stringify({})).done(function(response) {
            $('.iframeGuacamoleSnap', element).attr("src", "");
            $("#ViewFrameGuacamole  > img").attr('src', 'https://procan-group.com/imgXblock/window-icon.png');
            if (response.status === 'ok') {
                setTimeout(function() {
                    urlPost = response.ipg + "/guacamole/login.jsp";
                    $("iframe").removeAttr("name");
                    $('.iframeGuacamoleSnap', element).attr("name", "iframeGuacamoleSnap");
                    urlPost = response.ipg + "/guacamole/login.jsp";
                    var form = $('<form action="' + urlPost + '" method="post" target="iframeGuacamoleSnap">' +
                        '<input type="hidden" name="username" value="' + response.nomSnap + '-' + response.idSnap + '"></input>' +
                        '<input type="hidden" name="password" value="' + response.idSnap + '-' + response.nomSnap + '-' + response.idSnap + '"></input>' + '</form>');
                    console.log(form);
                    $(element).find('#form').append(form);
                    $('.iframeGuacamoleSnap', element).attr("src", "#");
                    $(".iframeGuacamoleSnap", element).width(900);
                    $(element).find(form).submit();
                    var iframeFOC = $(".iframeGuacamoleSnap")[0];
                    iframeFOC.contentWindow.focus();
                }, 500);
            } else if ((response.status === 'error') || (response.status === 'notAuthorized')) {
                runtime.notify('error', {
                    title: 'Error',
                    message: response.reason,
                    state: 'start'
                });
                setTimeout(function() {
                    runtime.notify('cancel', {})
                }, 10000);
            }
        });
    });

    //ViewGuacamole
    $(element).find('#ViewGuacamole').bind('click', function() {
        $(element).find(".iframeGuacamoleSnap").attr("src", "");
        $("#ViewGuacamole > img").attr('src', 'https://procan-group.com/imgXblock/colorful-loader-gif-transparent-11.gif');
        var handlerViewGuacamoleSnap = runtime.handlerUrl(element, 'ViewGuacamoleSnap');
        $.post(handlerViewGuacamoleSnap, JSON.stringify({})).done(function(response) {
            $("#ViewGuacamole  > img").attr('src', 'https://procan-group.com/imgXblock/display-icon.png');
            if (response.status === 'ok') {
                urlPost = response.ipg + "/guacamole/login.jsp";
                var form = $('<form action="' + urlPost + '" method="post" target="_blank">' +
                    '<input type="hidden" name="username" value="' + response.nomSnap + '-' + response.idSnap + '"></input>' +
                    '<input type="hidden" name="password" value="' + response.idSnap + '-' + response.nomSnap + '-' + response.idSnap + '"></input>' + '</form>');
                console.log(form);
                $(element).find('#form').append(form);
                $(element).find(form).submit();
            } else if ((response.status === 'error') || (response.status === 'notAuthorized')) {
                runtime.notify('error', {
                    title: 'Error',
                    message: response.reason,
                    state: 'start'
                });
                setTimeout(function() {
                    runtime.notify('cancel', {})
                }, 10000);
            }
        });
    });

    loading();
    InterfaceScenario();

}

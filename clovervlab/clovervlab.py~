"""TO-DO: Write a description of what this XBlock is."""
import pkg_resources
from xblock.core import XBlock
from xblock.exceptions import JsonHandlerError
from xblock.fields import Scope, Integer, String
from xblock.fragment import Fragment
from django.template import Context, Template
import logging
import urllib
import urllib2
import ssl
import requests
import json
from django.conf import settings
from django.contrib.auth.models import User
log = logging.getLogger(__name__)

@XBlock.wants("user")
class CLOVERVLABXBlock(XBlock):
    """
    TO-DO: document what your XBlock does.
    """
    # Fields are defined on the class.  You can access them in your code as
    # self.<fieldname>.
    # TO-DO: delete count, and define your own fields.
    display_name = String(display_name='Display Name',
                          default='Clover Vlab (VM)',
                          #scope=Scope.user_state,
                          scope=Scope.settings,
                          help='This name appears in the horizontal navigation at the top of the page.'
                          )
    image_name = String(display_name='Display Name image', default='',
                        scope=Scope.settings, help='')
    image_Des = String(default='', scope=Scope.settings, help='')
    image_os = String(default='', scope=Scope.settings, help='')
    image_Fla = String(default='', scope=Scope.settings, help='')
    Login = String(default='', scope=Scope.settings, help='')
    Password = String(default='', scope=Scope.settings, help='')
    cloverip = String(default='',
                      scope=Scope.settings,
                      help='The IP for Clover.')  
                                                                                                   
    def resource_string(self, path):
        """Handy helper for getting resources from our kit."""
        data = pkg_resources.resource_string(__name__, path)
        return data.decode('utf8')

    def render_template(self, template_path, context={}):
        """
        Evaluate a template by resource path, applying the provided context
        """
        template_str = self.load_resource(template_path)
        return Template(template_str).render(Context(context))

    def load_resource(self, resource_path):
        """
        Gets the content of a resource
        """
        resource_content = pkg_resources.resource_string(__name__,
                resource_path)
        return unicode(resource_content, 'utf-8')

    # TO-DO: change this view to display your data your own way.
    def student_view(self, context=None):
        """
        The primary view of the CLOVERVLABXBlock, shown to students
        when viewing courses.
        """
        context = {
            'display_name': self.display_name,
            'image_name': self.image_name,
            'ho': self.runtime.anonymous_student_id,
            'isstaff': self.runtime.user_is_staff,
            }
        html = self.render_template('static/html/clovervlab.html',
                                    context)
        frag = Fragment(html)
        if self.runtime.anonymous_student_id != 'student':
            frag.add_javascript(self.load_resource('static/js/src/clovervlab.js'
                                ))
	    frag.add_css(self.load_resource('static/css/clovervlab.css'))
            frag.add_css(self.load_resource('static/css/jquery-confirm.min.css'
                     ))
            frag.add_javascript(self.load_resource('static/js/src/jquery-confirm.min.js'
                            ))
            frag.initialize_js('CLOVERVLABXBlock')
        return frag

    def studio_view(self, context=None):
        """
        The secondary view of the XBlock, shown to teachers
        when editing the XBlock.
        """
        log.info('LLLLoginnnnn : {0} '.format(self.Login))
        user = self.runtime.service(self, 'user').get_current_user()
        log.info('username : {0} '.format(user.opt_attrs.get('edx-platform.username') ))
        context = {
            'display_name': self.display_name,
            'DNS_Clover': self.cloverip,
            'image_name': self.image_name,
            'LoginClover': self.Login,
            'ImageDescription': self.image_Des,
            'ImageOS': self.image_os,
            'ImageFlavor': self.image_Fla,
	    'username':user.opt_attrs.get('edx-platform.username') ,
            }
        html = \
            self.render_template('static/html/clovervlab_edit.html'
                                 , context)
        frag = Fragment(html)
        frag.add_javascript(self.load_resource('static/js/src/clovervlab_edit.js'
                            ))
        frag.add_css(self.load_resource('static/css/clovervlab_edit.css'
                     ))
        frag.add_css(self.load_resource('static/css/jquery-confirm.min.css'
                     ))
        frag.add_javascript(self.load_resource('static/js/src/jquery-confirm.min.js'
                            ))
        frag.add_css(self.load_resource('static/css/jquery.steps.css'))
        frag.add_javascript(self.load_resource('static/js/src/jquery.steps.js'
                            ))
        frag.initialize_js('clovervlabXBlockInitEdit')
        return frag

    @XBlock.json_handler
    def GetStatusInitial(self, data, suffix=''):
        """
        Get Image Status.
        """
        log.info('--Xblock GetStatusInitial')
        url = 'https://' + self.cloverip + '/GetStatusInitial'
        try:
	    if (self.Login == '') or (self.Password == '') or  (self.cloverip == ''):
		log.info('Login or Password is empty')
		return {'status': 'ok' ,'userStatus': 'notAuthorized' }
            data = \
                urllib.urlencode({'id_xblock': unicode(self.scope_ids.usage_id), 'loginclover': self.Login, 'passwordclover': self.Password})
            req = urllib2.Request(url, data)
            resp = urllib2.urlopen(req)
            code = resp.getcode()
            msgIStatus = resp.read()
        except:
            log.error('server unreachble GetStatusInitial')
            code = 400
            msgIStatus = 'except'
            return {'status': 'error',
                    'reason': 'There is an error, please try again later.'}
        msgIStatus = json.loads(msgIStatus)
        log.info('--Xblock responce servlet GetStatusInitial : {0} '.format(msgIStatus))
        return msgIStatus

    @XBlock.json_handler
    def FlavorsImage(self, data, suffix=''):
        """
         Get Flavors Status.
         """
        url = 'https://' + self.cloverip + '/GetFlavorsList'
        try:
            log.info('--Xblock GetFlavorsList')
            data = urllib.urlencode({'loginclover': self.Login,'passwordclover': self.Password })
            req = urllib2.Request(url, data)
            resp = urllib2.urlopen(req)
            code = resp.getcode()
            msgGFL = resp.read()
        except:
            log.error('server unreachble')
            code = 400
            msgGFL = 'except'
            return {'status': 'error',
                    'reason': 'There is an error, please try again later.'}
        msgGFL = json.loads(msgGFL)
        log.info('--Xblock responce servlet GetFlavorsList  : {0} '.format(msgGFL))
        log.info('--Xblock responce servlet GetFlavorsList  : {0} '.format(msgGFL['status'
                 ]))
        if (msgGFL['status'] == 'error') or (msgGFL['status'] == 'notAuthorized'):
            return msgGFL
        log.info('--Xblock responce servlet GetFlavorsList flavors  : {0} '.format(msgGFL['flavors'
                 ]))
        flavors = \
            "<select class='input setting-input' id='List_Flavors'  style='display:inline;width: 60%'>     <option disabled selected value> -- select an option -- </option>"
        for i in range(0, len(msgGFL['flavors'])):
            flavors += "<option data-Dis='" + str(msgGFL['flavors'
                    ][i]['Disque(Go)']) + "'  data-RAM='" \
                + str(msgGFL['flavors'][i]['RAM(MB)']) \
                + "' data-VCPUs='" + str(msgGFL['flavors'][i]['VCPUs']) \
                + "'  value='" + msgGFL['flavors'][i]['Id'] \
                + "' data-os='" + msgGFL['flavors'][i]['os'] + "' >" \
                + msgGFL['flavors'][i]['Name'] + ' </option>'
        flavors += '</select>'
        url = 'https://' + self.cloverip + '/GetImagesList'
        try:
            log.info('--Xblock GetImagesList')
            data = urllib.urlencode({'loginclover': self.Login,'passwordclover': self.Password })
            req = urllib2.Request(url, data)
            resp = urllib2.urlopen(req)
            code = resp.getcode()
            msgGIL = resp.read()
        except:
            log.error('server unreachble')
            code = 400
            msgGFL = 'except'
            return {'status': 'error',
                    'reason': 'There is an error, please try again later.'}
        msgGIL = json.loads(msgGIL)
        if (msgGIL['status'] == 'error') or (msgGIL['status'] == 'notAuthorized'):
            return msgGIL
        log.info('--Xblock responce servlet GetImagesList : {0} '.format(msgGIL))
        image = \
            "<select class='input setting-input' id='List_Image'  style='display:inline;width: 60%' > <option disabled selected value> -- select an option -- </option>"
        for i in range(0, len(msgGIL['images'])):
            image += "<option value='" + msgGIL['images'][i]['Id'] \
                + "'>" + msgGIL['images'][i]['Name'] + ' </option>'
        image += '</select>'
        url = 'https://' + self.cloverip + '/GetImagesListNotBase'
        try:
            log.info('--Xblock GetImagesListNotBase')
            data = urllib.urlencode({ 'loginclover': self.Login,'passwordclover': self.Password })
            req = urllib2.Request(url, data)
            resp = urllib2.urlopen(req)
            code = resp.getcode()
            msgLNB = resp.read()
        except:
            log.error('server unreachble')
            code = 400
            msgLNB = 'except'
            return {'status': 'error',
                    'reason': 'There is an error, please try again later.'}
        msgLNB = json.loads(msgLNB)
        if (msgLNB['status'] == 'error') or (msgLNB['status'] == 'notAuthorized') :
            return msgLNB
        log.info('--Xblock responce servlet GetImagesListNotBase : {0} '.format(msgLNB))
        imageexisting = \
            "<select class='input setting-input' id='List_ListNotBase'  style='display:inline;width: 60%'> <option disabled selected value> -- select an option -- </option>"
        for i in range(0, len(msgLNB['images'])):
            imageexisting += "<option value='" + msgLNB['images'
                    ][i]['Id'] + "'>" + msgLNB['images'][i]['Name'] \
                + ' </option>'
        imageexisting += '</select>'
        return {
            'status': 'ok',
            'flavors': flavors,
            'image': image,
            'imageexisting': imageexisting,
            }

    @XBlock.json_handler
    def GetImageStatus(self, data, suffix=''):
        """
        Get Image Status.
        """
        log.info('--Xblock GetImageStatus')
        if (self.Login == '') or (self.Password == '') or  (self.cloverip == ''):
                log.info('Login or Password is empty')
                return {'status': 'ok' ,'userStatus': 'notAuthorized' }

        url = 'https://' + self.cloverip + '/GetImageStatus'
        try:
            data = \
                urllib.urlencode({'id_xblock': unicode(self.scope_ids.usage_id)})
            req = urllib2.Request(url, data)
            resp = urllib2.urlopen(req)
            code = resp.getcode()
            msgIStatus = resp.read()
        except:
            log.error('server unreachble GetImageStatus')
            code = 400
            msgIStatus = 'except'
            return {'status': 'error',
                    'reason': 'There is an error, please try again later.'}
        msgIStatus = json.loads(msgIStatus)
        log.info('--Xblock responce servlet GetImageStatus : {0} '.format(msgIStatus))
        return msgIStatus

    @XBlock.json_handler
    def change_display_name(self, data, suffix=''):
        """
        change display name
        """
        self.display_name = data['display_name']
        log.info('--New display name : {0} '.format(self.display_name))
        return {'status': 'ok'}

    @XBlock.json_handler
    def funLoginClover(self, data, suffix=''):
        """
        Log in Clover
        """
        login = data['Login']
        password = data['Password']
        urlclover=  data['UrlClover']
        url = 'https://'+urlclover+'/CheckAuthentication'
        try:
            log.info('--Xblock CheckAuthentication')
            data = urllib.urlencode({'loginclover': data['Login'],
                                    'passwordclover': data['Password']})
            req = urllib2.Request(url, data)
            resp = urllib2.urlopen(req)
            code = resp.getcode()
            msgCheckAuthentication = resp.read()
        except:
            log.error('server unreachble')
            code = 400
            msgGFL = 'except'
            return {'status': 'error',
                    'reason': 'There is an error, please try again later.'}
        msgCheckAuthentication = json.loads(msgCheckAuthentication)
        log.info('--Xblock responce servlet CheckAuthentication : {0} '.format(msgCheckAuthentication))
        status = msgCheckAuthentication.get('status')
        user = self.runtime.service(self, 'user').get_current_user()
        if status == 'ok':
            self.Login = login
            self.Password = password
	    self.cloverip= urlclover
            return {'status': 'ok'}
        else:
            return msgCheckAuthentication

    @XBlock.json_handler
    def funLogoutClover(self, data, suffix=''):
        """
        Logout from Clover
        """
        log.info('logout for user: {0}'.format(self.Login))
        self.Login = ''
        self.Password = ''
	self.cloverip = ''
        return {'status': 'ok'}

    @XBlock.json_handler
    def create_ImageDirect(self, data, suffix=''):
        """
        create image from existing image.
        """
        self.image_name = data['image_name']
        self.image_Des = data['description']

        user = self.runtime.service(self, 'user').get_current_user()

        url = 'https://' + self.cloverip + '/AddImageDirect'
        try:
            log.info('--Xblock AddImageDirect --id existing image: {0}'.format(data['id_ancien_snap'
                     ]))
            data = urllib.urlencode({
                'id_xblock': unicode(self.scope_ids.usage_id),
                'nom_snap': data['image_name'],
                'id_ancien_snap': data['id_ancien_snap'],
                'loginclover': self.Login,
                'passwordclover': self.Password,
		'urlclover':'https://' + self.cloverip,
                })
            req = urllib2.Request(url, data)
            resp = urllib2.urlopen(req)
            code = resp.getcode()
            msgAddImage = resp.read()
        except:
            log.error('server unreachble')
            code = 400
            msgAddImage = 'except'
            return {'status': 'error',
                    'reason': 'There is an error, please try again later.'}
        msgAddImage = json.loads(msgAddImage)
        log.info('--Xblock responce servlet AddImageDirect : {0} '.format(msgAddImage))
        return msgAddImage

    @XBlock.json_handler
    def create_image(self, data, suffix=''):
        """
        create image.
        """
        self.image_name = data['image_name']
        self.image_Des = data['description']
        self.image_os = data['imageText']
        self.image_Fla = data['flavorsText']
        log.info('--imageText: {0} flavorsText {1}  '.format(self.image_os,
                 self.image_Fla))

        user = self.runtime.service(self, 'user').get_current_user()

        url = 'https://' + self.cloverip + '/AddImage'
        try:
            log.info('--Xblock create image')
            data = urllib.urlencode({
                'id_xblock': unicode(self.scope_ids.usage_id),
                'nom_snap': data['image_name'],
                'id_ancien_snap': data['image'],
                'flavor': data['flavors'],
                'loginclover': self.Login,
                'passwordclover': self.Password,
		'urlclover':'https://' + self.cloverip,
                })
            req = urllib2.Request(url, data)
            resp = urllib2.urlopen(req)
            code = resp.getcode()
            msgAddImage = resp.read()
        except:
            log.error('server unreachble')
            code = 400
            msgAddImage = 'except'
            return {'status': 'error',
                    'reason': 'There is an error, please try again later.'}
        msgAddImage = json.loads(msgAddImage)
        log.info('--Xblock responce servlet create_image : {0} '.format(msgAddImage))
        return msgAddImage

    @XBlock.json_handler
    def GetSnapshot(self, data, suffix=''):
        """
        Get Snapshot.
        """
        url = 'https://' + self.cloverip + '/GetSnapshot'
        try:
            log.info('--Xblock GetSnapshot')
            data = \
                urllib.urlencode({'id_xblock': unicode(self.scope_ids.usage_id),'loginclover': self.Login,'passwordclover': self.Password })
            req = urllib2.Request(url, data)
            resp = urllib2.urlopen(req)
            code = resp.getcode()
            msgGetSnapshot = resp.read()
        except:
            log.error('server unreachble')
            code = 400
            msgGetSnapshot = 'except'
            return {'status': 'error',
                    'reason': 'There is an error, please try again later.'}
        msgGetSnapshot = json.loads(msgGetSnapshot)
        msgGetSnapshot.update({'image_Des': self.image_Des,
                              'image_os': self.image_os,
                              'image_Fla': self.image_Fla})
        log.info('--Xblock responce servlet msgGetSnapshot : {0} '.format(msgGetSnapshot))
        return msgGetSnapshot

    @XBlock.json_handler
    def Confirm_image(self, data, suffix=''):
        """
        Confirm the creation of the image.
        """
        url = 'https://' + self.cloverip + '/ConfirmAddImage'
        try:
            log.info('--Xblock ConfirmAddImage')
            data = \
                urllib.urlencode({'id_xblock': unicode(self.scope_ids.usage_id),'loginclover': self.Login,'passwordclover': self.Password })
            req = urllib2.Request(url, data)
            resp = urllib2.urlopen(req)
            code = resp.getcode()
            msgConfirmImage = resp.read()
        except:
            log.error('server unreachble')
            code = 400
            msgConfirmImage = 'except'
            return {'status': 'error',
                    'reason': 'There is an error, please try again later.'}
        msgConfirmImage = json.loads(msgConfirmImage)
        log.info('--Xblock responce servlet msgConfirmImage : {0} '.format(msgConfirmImage))
        return msgConfirmImage

    @XBlock.json_handler
    def Delete_Image(self, data, suffix=''):
        """
        Delete Image.
        """
        url = 'https://' + self.cloverip + '/Delete_Image'
        try:
            log.info('--Xblock DeleteImage')
            data = \
                urllib.urlencode({'id_xblock': unicode(self.scope_ids.usage_id),'loginclover': self.Login,'passwordclover': self.Password })
            req = urllib2.Request(url, data)
            resp = urllib2.urlopen(req)
            code = resp.getcode()
            msgDeleteImage = resp.read()
        except:
            log.error('server unreachble')
            code = 400
            msgDeleteImage = 'except'
            return {'status': 'error',
                    'reason': 'There is an error, please try again later.'}
        msgDeleteImage = json.loads(msgDeleteImage)
        log.info('--Xblock responce servlet msgDeleteImage : {0} '.format(msgDeleteImage))
        return msgDeleteImage

    @XBlock.json_handler
    def GetVMStatus(self, data, suffix=''):
        """
        Get VM Status.
        """
        url = 'https://' + self.cloverip + '/GetVMStatus'
        try:
            log.info('--Xblock GetVMStatus')
            data = \
                urllib.urlencode({'id_xblock': unicode(self.scope_ids.usage_id),
                                 'id_user': self.runtime.user_id,})
            req = urllib2.Request(url, data)
            resp = urllib2.urlopen(req)
            code = resp.getcode()
            msgGetVMStatus = resp.read()
        except:
            log.error('server unreachble')
            code = 400
            msgGetVMStatus = 'except'
            return {'status': 'error',
                    'reason': 'There is an error, please try again later.'}
        msgGetVMStatus = json.loads(msgGetVMStatus)
        log.info('--Xblock responce servlet msgGetVMStatus : {0} '.format(msgGetVMStatus))
        return msgGetVMStatus

    @XBlock.json_handler
    def Create_VM(self, data, suffix=''):
        """
        Create VM.
        """
        url = 'https://' + self.cloverip + '/Start_VM_WithThread'
        try:
            log.info('--Xblock Start_VM_WithThread ')
            log.info('id_xblock  : {0} '.format(unicode(self.scope_ids.usage_id)))
            log.info('id_user  : {0} '.format(self.runtime.user_id))
            user = self.runtime.service(self, 'user').get_current_user()
            log.info('current user  : {0} '.format(user.full_name))
            data = \
                urllib.urlencode({'id_xblock': unicode(self.scope_ids.usage_id),
                                 'id_user': self.runtime.user_id,'loginclover': self.Login,'passwordclover': self.Password,
                                 'login_user': user.opt_attrs.get('edx-platform.username'
                                 )})
            req = urllib2.Request(url, data)
            resp = urllib2.urlopen(req)
            code = resp.getcode()
            msgStart_VM_WithThread = resp.read()
        except:
            log.error('server unreachble')
            code = 400
            msgStart_VM_WithThread = 'except'
            return {'status': 'error',
                    'reason': 'There is an error, please try again later.'}
        msgStart_VM_WithThread = json.loads(msgStart_VM_WithThread)
        log.info('--Xblock responce servlet msgtart_VM_WithThread : {0} '.format(msgStart_VM_WithThread))
        return msgStart_VM_WithThread

    @XBlock.json_handler
    def Stop_VM(self, data, suffix=''):
        """
        Stop VM.
        """
        url = 'https://' + self.cloverip + '/Stop_VM'
        try:
            log.info('--Xblock Stop_VM')
            log.info('id_xblock  : {0} '.format(unicode(self.scope_ids.usage_id)))
            log.info('id_user  : {0} '.format(self.runtime.user_id))
            data = \
                urllib.urlencode({'id_xblock': unicode(self.scope_ids.usage_id),'loginclover': self.Login,'passwordclover': self.Password,
                                 'id_user': self.runtime.user_id})
            req = urllib2.Request(url, data)
            resp = urllib2.urlopen(req)
            code = resp.getcode()
            msgStop_VM = resp.read()
        except:
            log.error('server unreachble')
            code = 400
            msgStop_VM = 'except'
            return {'status': 'error',
                    'reason': 'There is an error, please try again later.'}
        msgStop_VM = json.loads(msgStop_VM)
        log.info('--Xblock responce servlet msgStop_VM : {0} '.format(msgStop_VM))
        return msgStop_VM

    @XBlock.json_handler
    def deleteVM(self, data, suffix=''):
        """
        Delete VM.
        """
        url = 'https://' + self.cloverip + '/Delete_VM'
        try:
            log.info('--Xblock Delete_VM')
            log.info('data  id_xblock  : {0} ,id_user  : {1} '.format(unicode(self.scope_ids.usage_id), self.runtime.user_id ))
            data = \
                urllib.urlencode({'id_xblock': unicode(self.scope_ids.usage_id),'loginclover': self.Login,'passwordclover': self.Password,
                                 'id_user': self.runtime.user_id})
            req = urllib2.Request(url, data)
            resp = urllib2.urlopen(req)
            code = resp.getcode()
            msgDelete_VM = resp.read()
        except:
            log.error('server unreachble')
            code = 400
            msgDelete_VM = 'except'
            return {'status': 'error',
                    'reason': 'There is an error, please try again later.'}
        msgDelete_VM = json.loads(msgDelete_VM)
        log.info('--Xblock responce servlet msgDelete_VM  : {0} '.format(msgDelete_VM))
        return msgDelete_VM

    @XBlock.json_handler
    def RebootVM(self, data, suffix=''):
        """
        Reboot VM.
        """
        url = 'https://' + self.cloverip + '/Restart_VM'
        try:
            log.info('--Xblock Restart_VM')
            log.info('data -id_xblock  : {0}  -id_user  : {1}'.format(unicode(self.scope_ids.usage_id),self.runtime.user_id))
            data = \
                urllib.urlencode({'id_xblock': unicode(self.scope_ids.usage_id),'loginclover': self.Login,'passwordclover': self.Password ,
                                 'id_user': self.runtime.user_id})
            req = urllib2.Request(url, data)
            resp = urllib2.urlopen(req)
            code = resp.getcode()
            msgRestart_VM = resp.read()
        except:
            log.error('server unreachble')
            code = 400
            msgRestart_VM = 'except'
            return {'status': 'error',
                    'reason': 'There is an error, please try again later.'}
        msgRestart_VM = json.loads(msgRestart_VM)
        log.info('--Xblock responce servlet msgRestart_VM  : {0} '.format(msgRestart_VM))
        return msgRestart_VM

    @XBlock.json_handler
    def StartVm(self, data, suffix=''):
        """
        Start Vm.
        """
        url = 'https://' + self.cloverip + '/Start_VM'
        try:
            log.info('--Xblock start_VM')
            log.info('data  -id_xblock  : {0}  -id_user  : {1}'.format(unicode(self.scope_ids.usage_id), self.runtime.user_id ))
            data = \
                urllib.urlencode({'id_xblock': unicode(self.scope_ids.usage_id),'loginclover': self.Login,'passwordclover': self.Password ,
                                 'id_user': self.runtime.user_id})
            req = urllib2.Request(url, data)
            resp = urllib2.urlopen(req)
            code = resp.getcode()
            msgstart_VM = resp.read()
        except:
            log.error('server unreachble')
            code = 400
            msgstart_VM = 'except'
            return {'status': 'error',
                    'reason': 'There is an error, please try again later.'}
        msgstart_VM = json.loads(msgstart_VM)
        log.info('--Xblock responce servlet msgstart_VM  : {0} '.format(msgstart_VM))
        return msgstart_VM

    @XBlock.json_handler
    def ViewDesktop(self, data, suffix=''):
        """
        View Desktop.
        """
        url = 'https://' + self.cloverip + '/GetVM'
        try:
            log.info('--Xblock GetVM')
            data = \
                urllib.urlencode({'isstaff': self.runtime.user_is_staff,
                                 'id_xblock': unicode(self.scope_ids.usage_id),'loginclover': self.Login,'passwordclover': self.Password,
                                 'id_user': self.runtime.user_id})
            req = urllib2.Request(url, data)
            resp = urllib2.urlopen(req)
            code = resp.getcode()
            msgGetVM = resp.read()
        except:
            log.error('server unreachble')
            code = 400
            msgGetVM = 'except'
            return {'status': 'error',
                    'reason': 'There is an error, please try again later.'}
        msgGetVM = json.loads(msgGetVM)
        log.info('--Xblock responce servlet msgGetVM : {0} '.format(msgGetVM))
        return msgGetVM

    @XBlock.json_handler
    def ViewGuacamole(self, data, suffix=''):
        """
        View Guacamole.
        """
        url = 'https://' + self.cloverip + '/AddVmToGuacamole'
        try:
            log.info('--Xblock GetVM')
            data = \
                urllib.urlencode({'isstaff': self.runtime.user_is_staff,
                                 'id_user': self.runtime.user_id,'loginclover': self.Login,'passwordclover': self.Password,
                                 'id_xblock': unicode(self.scope_ids.usage_id)})
            req = urllib2.Request(url, data)
            resp = urllib2.urlopen(req)
            code = resp.getcode()
            msgViewGuacamole = resp.read()
        except:
            log.error('server unreachble')
            code = 400
            msgViewGuacamole = 'except'
            return {'status': 'error',
                    'reason': 'There is an error, please try again later.'}
        msgViewGuacamole = json.loads(msgViewGuacamole)
        log.info('--Xblock responce servlet msgViewGuacamole : {0} '.format(msgViewGuacamole))
        return msgViewGuacamole

    @XBlock.json_handler
    def ViewGuacamoleSnap(self, data, suffix=''):
        """
        View Guacamole for snapshot.
        """
        url = 'https://' + self.cloverip + '/AddSnapToGuacamole'
        try:
            log.info('--Xblock GetVM')
            data = \
                urllib.urlencode({'id_xblock': unicode(self.scope_ids.usage_id),'loginclover': self.Login,'passwordclover': self.Password })
            req = urllib2.Request(url, data)
            resp = urllib2.urlopen(req)
            code = resp.getcode()
            msgAddSnapToGuacamole = resp.read()
        except:
            log.error('server unreachble')
            code = 400
            msgAddSnapToGuacamole = 'except'
            return {'status': 'error',
                    'reason': 'There is an error, please try again later.'}
        msgAddSnapToGuacamole = json.loads(msgAddSnapToGuacamole)
        log.info('--Xblock responce servlet msgAddSnapToGuacamole : {0} '.format(msgAddSnapToGuacamole))
        return msgAddSnapToGuacamole

    # TO-DO: change this to create the scenarios you'd like to see in the
    # workbench while developing your XBlock.
    @staticmethod
    def workbench_scenarios():
        """A canned scenario for display in the workbench."""
        return [('CLOVERVLABXBlock', """<clovervlab/>
             """
                ), ('Multiple CLOVERVLABXBlock',
                """<vertical_demo>
                <clovervlab/>
                <clovervlab/>
                <clovervlab/>
                </vertical_demo>
             """)]

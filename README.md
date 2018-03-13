# xblock-clover


The CloVER XBlock integrates virtual lab environments into practical based edx courses. The XBlock allows students to conduct experiments using a virtual computers and desktops running on public or private Openstack Clouds. The XBlock interacts with the CloVER application, offered online as a cloud service for organisations and institutions. CloVER is a connection broker that instanciates on demand virtual desktops and servers in Openstack environments (owned and managed by the organisation or institution) and offers them to teachers and students in a scalable, reliable and secure manner. It has been developed by [ProCAN](http://www.procan-group.com)

## Installation

    # Move to the folder where you want to download the XBlock
    cd /edx/app/edxapp
    # Download the XBlock
    sudo -u edxapp git clone https://github.com/procangroup/xblock-clover.git
    # Install the XBlock
    sudo -u edxapp /edx/bin/pip.edxapp install xblock-clover/
    # restart edxapp:
    sudo /edx/bin/supervisorctl restart edxapp:

## Enabling in studio

You can enable the XBlock in studio through the advanced settings.

1. From the main page of a specific course, navigate to `Settings ->
   Advanced Settings` from the top menu.
2. Navigate to the section titled `Advanced Module List` policy key, and add `"clovervlab"`
   to the policy value list.
3. Click the "Save changes" button.


## Usage

To add the CloVER block to a unit, choose Clover VLAB from the Advanced Components list in the studio.
When you add the CloVER component to a course in the studio, the block is field with default content, shown in the screenshot below.

1. Enter your Clover credentials (Password) as well as the URL of your CloVER instance.  

    ![Authentication_to_clover](https://github.com/procangroup/clover_images/blob/master/authen.png)
    
    
2. Select your appropriate VLAB scenario. For this xblock version (v1), only single VM instanciation is available.
    
    ![scenario_select](https://github.com/procangroup/clover_images/blob/master/scenario.png)
    
3. Create a Cloud image containing a bootable operating system (Linux or Windows) and a set of tools and software applications required to run the virtual Lab or HomeWork. Once created, Students can launch their instances from the same image. Each launched instance runs from a copy of the base image. 
To prepare your image, you need first to instanciate a virtual desktop (from a native OS image or from an existing pre-built image) to install the required tools and software appliations. Once finished, you can create a snapshot to capture the state of the virtual desktop running disk and build a cloud image (Step 4). The interface in bellow allow the instanciation of a personalised VM to set up your VLAB: 

  - **Image Name**: The name of the image
  - **Description**: Description of the image
  - **Type**: Select "New image" if this is the first creation of a new image with a basic Operating System. In the case where you want to update or modify the content of an old cloud image, select "Existing Image".
  - **Image's OS**: In the case of "New Image", you must specify the OS type and release
  - **Flavor**: When you launch an instance, you must choose a flavor, which represents a set of virtual resources. Flavors define virtual CPU number, RAM amount available, and ephemeral disks size. CloVER provides a number of predefined flavors for both Linux and Windows operating system.
    
    ![image_create](https://github.com/procangroup/clover_images/blob/master/create_image.png)
    
    4. Access your desktop to install the required tools and software appliations. Two access mode are available to open console either in new tab (you should to allow pop-us in your browser) or in the same window frame.  
    
    ![image_preparation](https://github.com/procangroup/clover_images/blob/master/prepare_image.png)
    
    5. Once the vlab installation is finished, click the "Confirm image" button to create a snapshot of the running desktop and to build a new image based on this snapshot.

    ![image_confirmation](https://github.com/procangroup/clover_images/blob/master/confirm_image_window.png)
    
    6. Please wait few minutes until the interface in bellow appears. Gongratulations ! Your cloud image including your vlab tools and applications is ready.  
    
    ![image_ready](https://github.com/procangroup/clover_images/blob/master/image_ready.png)
    
Students can now launch their instances from the pre-built image via the LMS.

    
## Student Experience

1. Navigate to the student view (LMS) of the course and find your VLAB environment (click “View Live” in Studio).
2. The Course Staff or the Student can instantiate a VM in the Cloud using the interface in below. Click the "Start VM" button to instanciate a VM from the image prepared by the Course Staff.
    
    ![vm start](https://github.com/procangroup/clover_images/blob/master/lms_start-vm.png)
    
3. Once the VM is created, you can access your (linux or windows) desktop from anywhere and using any device over the web-based, clientless and multi-protocol CloVER Connection Broker.  You can also Reboot, Stop and Delete your VM if the need arises. 
    
    ![vm access](https://github.com/procangroup/clover_images/blob/master/lms_vm_access.png)
    
4. You can start use your desktop immediately !    
    
    ![vm access_window](https://github.com/procangroup/clover_images/blob/master/lms_vm_access_window.png)
    

## Testing

Assuming `xblock-clover` is installed as above, you can test the Clover block to create image and instantiate desktops. A Clover as a Service instance (democlover.daasbroker.com) based on a ProCAN Openstack Project is made available for you.

1. You should first create an Edx account. Enter in the `Public Username` Field the following username: democlover

2. Add a Clover block to Unit. In the Authentication Interface (see Section Usage above, Step 1), Enter your Clover password and URL as follows:  
  - **Password**: passclover
  - **CloVER URL**: democlover.daasbroker.com

Since the provided ClovER instance (democlover.daasbroker.com) is made for demo/test purpose, only three desktops are allowed to be created. If you need a dedicated ClovER instance for testing, please contact us: contact@procan-group.com 
    
## License

The XBlock Clover Vlab is available under the GNU Affero General Public License (AGPLv3).



# xblock-cloverbeta

This package provides an XBlock for use with the open edX platform which
provides a staff graded assignment. Students are invited to upload files
which encapsulate their work on the assignment. Instructors are then
able to download the files and enter grades for the assignment. It has been developed by [ProCAN](http://www.procan-group.com)

## Installation

Install the requirements into the python virtual environment of your
`edx-platform` installation by running the following command from the
root folder:

```bash
$ pip install -r requirements.txt
```

## Enabling in studio

You can enable the XBlock in studio through the advanced settings.

1. From the main page of a specific course, navigate to `Settings ->
   Advanced Settings` from the top menu.
2. Navigate to the section titled `Advanced Module List` policy key, and add `"clover_vlab"`
   to the policy value list.
3. Click the "Save changes" button.






4. Settings

  - **display_name**: The name appears in the horizontal navigation at the top of the page
  - **Maximum Score**: Maximum grade score given to assignment by staff
  - **Problem Weight**: Defines the number of points each problem is worth.
  - **Show Answer**: Specifies if and when the student will see the correct answer to the problem.
  - **Solution**: The solution that is shown to the student if Show Answer is enabled for the problem. 

    ![Authentication_to_clover](https://github.com/procangroup/clover_images/blob/master/authen.png)
    
    ![scenario_select](https://github.com/procangroup/clover_images/blob/master/scenario.png)
    
    ![image_create](https://github.com/procangroup/clover_images/blob/master/create_image.png)
    
    ![image_preparation](https://github.com/procangroup/clover_images/blob/master/prepare_image.png)

    ![image_confirmation](https://github.com/procangroup/clover_images/blob/master/confirm_image_window.png)
    
    ![image_loading](https://github.com/procangroup/clover_images/blob/master/image_loading.png)
    
    ![image_ready](https://github.com/procangroup/clover_images/blob/master/image_ready.png)
    
    ![vm start](https://github.com/procangroup/clover_images/blob/master/lms_start-vm.png)
    
    ![vm creation](https://github.com/procangroup/clover_images/blob/master/lms_vm_creation.png)
    
    ![vm access](https://github.com/procangroup/clover_images/blob/master/lms_vm_access.png)
    
    ![vm access_window](https://github.com/procangroup/clover_images/blob/master/lms_vm_access_window.png)
    




5. Grading Policy

    SGA XBlocks inherit grading settings just like any other problem type. You
    can include them in homework, exams or any assignment type of your choosing.

## Course Authoring in XML

XML for an SGA XBlock consists of one tag with the five attributes mentioned
above. It is recommended to also include a url_name attribute. For example:

```xml
<vertical display_name="Staff Graded Assignment">
    <edx_sga url_name="sga_example" weight="10.0" display_name="SGA Example" points="100.0" showanswer="past_due" solution="solution text" />
</vertical>
```
You can specify the following values for the show answer attribute.
* always
* answered
* attempted
* closed
* correct_or_past_due
* finished
* past_due
* never

## Staff Grading

1. Navigate to the student view (LMS) of the course and find the vertical with
    your Staff Graded Assignment. (If you are in Studio, click "View Live").

1. If you are Course Staff or an Instructor for the course, you will see a
    "Grade Submissions" button in the lower right corner of the XBlock (Be sure
    you are in "Staff View" indicated by a red label in the upper right corner of
    the page; if it says "Student View" in green, click on it once.)

    ![Staff view of LMS interface](https://raw.githubusercontent.com/mitodl/edx-sga/screenshots/img/screenshot-lms-before-upload.png)

1. When you click "Grade Submissions" a grid of student submissions will display
    in a lightbox. Columns for username, (full) name, Filename and Uploaded
    (time) will be filled in.

    ![Staff view of grading grid](https://raw.githubusercontent.com/mitodl/edx-sga/screenshots/img/screenshot-staff-grading-interface.png)

1. Click the filename in any row to download the student's submission. If it can
    be displayed in your browser, it will.

1. Click the **Enter grade** link to bring up an interface to enter grades and
    comments.

    ![Enter grade interface](https://raw.githubusercontent.com/mitodl/edx-sga/screenshots/img/screenshot-staff-enter-grade.png)

1. The grades and comments will appear in the grid. Use the "Upload Annotated
    File" button to upload a file in response to the student's submission. The
    student will be able to view the file along with her grade.

    ![Instructor view of grading grid after a submission has been graded.](https://raw.githubusercontent.com/mitodl/edx-sga/screenshots/img/screenshot-graded.png)

1. Course staff can enter grades, but they are not final and students won't see
    them until they are submitted by an instructor. When a grade is waiting for
    instructor approval, it appears in the submissions grid with the text
    `(Awaiting instructor approval)` after it.

    ![Detail of Staff Member view of grading grid after a submission has been graded and it is awaiting approval.](https://raw.githubusercontent.com/mitodl/edx-sga/screenshots/img/screenshot-awaiting-approval.png)

    After a course staff member has submitted a grade, the instructor will see a
    link to **Approve grade** instead of **Enter grade**.

    ![Detail of Instructor view of grading grid after a submission has been graded and it can be appproved.](https://raw.githubusercontent.com/mitodl/edx-sga/screenshots/img/screenshot-approve-grade.png)

    Clicking **Approve grade** will open the same grading dialog box where, in
    addition to approving the grade, she can change the grade and the comment.

    Once the instructor has approved or entered a grade, course staff members
    cannot change it. However, the instructor can always change a grade.

1. After the grade has been approved, the student will be able to see it inline
    and also in her progress page. Annotated files, if any, will be available
    for download.

    ![Student view of graded assignment with annotated instructor response](https://raw.githubusercontent.com/mitodl/edx-sga/screenshots/img/screenshot-lms-student-video-graded.png)

## Testing

Assuming `edx-sga` is installed as above, integration tests can be run in devstack with this command:

```sh
python manage.py lms --settings=test test edx_sga.tests.integration_tests
```

To run tests on your host machine (with a mocked edX platform):
    
```sh
# Run tests using different versions of Django
tox
# Run tests using a specific version of Django
tox -e py27-django111
```

To get statement coverage (in devstack):

```sh
coverage run --source edx_sga manage.py lms --settings=test test edx_sga.tests.integration_tests
coverage report -m
```

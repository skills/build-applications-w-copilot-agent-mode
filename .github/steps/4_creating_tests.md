## Step 4: Creat and run tests for the OctoFit Tracker application

### :keyboard: Creat tests for the OctoFit Tracker application

The OctoFit Tracker application should have tests to ensure that the functionality works as expected. The tests will be divided into two parts: backend tests and frontend tests.

- **Backend Tests**: These tests will be written using Django's built-in testing framework. They will cover the models, views, and serializers.
- **Frontend Tests**: These tests will be written using Jest and React Testing Library. They will cover the components and their interactions.
- **Test Plan**: A test plan will be created to outline the testing strategy, including the types of tests to be performed and the expected outcomes.
- **Test Cases**: Specific test cases will be created for each component and functionality of the application.
- **Test Execution**: The tests will be executed to ensure that all functionalities are working as expected.
- **Test Results**: The results of the tests will be documented, including any failures and the steps taken to resolve them.
- **Test Documentation**: The test documentation will include the test plan, test cases, and test results. This documentation will be useful for future reference and for onboarding new developers to the project.

### :keyboard: Commands to run the tests

#### Backend Tests

To run the backend tests, use the following commands:

```bash
cd octofit-tracker/backend
source venv/bin/activate
python manage.py test
```

#### Frontend Tests

To run the frontend tests, use the following commands:

```bash
cd octofit-tracker/frontend
npm test
```

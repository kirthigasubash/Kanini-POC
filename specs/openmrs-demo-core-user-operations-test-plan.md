# OpenMRS Demo Core End-User Operations Test Plan

## Application Overview

This plan covers the five primary operational workflows observed in the OpenMRS 3 demo at https://dev3.openmrs.org/openmrs/spa/login: authenticated access, patient registration, patient search and clinical documentation, appointment management, and laboratory orders/results. Each scenario assumes a fresh browser context and uses the supplied demo account (admin / Admin123) unless its steps explicitly test an invalid credential. Test data created by a scenario must use a unique timestamp suffix so the scenario can be run independently and without colliding with seeded demo data.

## Test Scenarios

### 1. Core end-user workflows

**Seed:** `tests/seed.spec.ts`

#### 1.1. Authenticate and establish the clinical working context

**File:** `tests/openmrs-core-user-operations/authentication.spec.ts`

**Steps:**
  1. Start with a fresh browser context and navigate to https://dev3.openmrs.org/openmrs/spa/login.
    - expect: The OpenMRS login page is displayed with the OpenMRS logo, Username field, and Continue button.
    - expect: No authenticated navigation or patient data is visible.
  2. Select Continue without entering a username.
    - expect: The username is rejected as required or the user remains unable to progress to an authenticated session.
    - expect: No session is created.
  3. Enter an invalid username or incorrect password, progress through the two-step login flow, and select Log in.
    - expect: Authentication fails with a visible error or the user remains on the login page.
    - expect: The application must not redirect to /openmrs/spa/home.
  4. Enter username admin, select Continue, enter password Admin123, and select Log in.
    - expect: The password stage is shown only after the username is accepted.
    - expect: The user is redirected to the authenticated home area, observed as Service queues.
    - expect: The global navigation is available, including Search patient, Add patient, Change location, App Menu, and My Account.
  5. Open Change location and retain or select Outpatient Clinic, then close the control.
    - expect: The current clinical location is clearly shown as Outpatient Clinic.
    - expect: The selected location is reflected in the header and is available to downstream workflows.

#### 1.2. Register a new patient with mandatory demographics and optional contact information

**File:** `tests/openmrs-core-user-operations/patient-registration.spec.ts`

**Steps:**
  1. Start with a fresh authenticated session at Outpatient Clinic and select Add patient.
    - expect: The Create new patient page opens.
    - expect: The form is organized into Basic Info, Contact Details, and Relationships, with Register patient and Cancel actions.
  2. Select Register patient without entering mandatory Basic Info values.
    - expect: Submission is blocked.
    - expect: Required fields in the demographics section show clear validation feedback and no patient record is created.
  3. Enter a unique First Name and Family Name, choose a valid Sex value, and enter a valid date of birth using the displayed date format; leave optional middle name and contact fields blank.
    - expect: The required demographic values are accepted.
    - expect: The CR Number is shown as auto-generated and optional fields do not incorrectly prevent registration.
  4. Optionally provide valid address and phone data, then select Register patient once.
    - expect: Registration completes without duplicate submission.
    - expect: The new patient is opened in a patient chart or a clear confirmation provides the new patient identity/identifier.
  5. Use Search patient to find the new patient by their unique name or generated CR Number.
    - expect: Exactly the newly registered patient is returned with matching demographics and identifier.
    - expect: The result opens the correct patient chart.

#### 1.3. Find an existing patient and document current vital signs

**File:** `tests/openmrs-core-user-operations/patient-chart-vitals.spec.ts`

**Steps:**
  1. Start with a fresh authenticated session at Outpatient Clinic and select Search patient.
    - expect: The global search panel opens with the prompt to search by name or identifier number and a Close Search Panel control.
  2. Search for Kenneth Carter or identifier 10001C6.
    - expect: A matching result is shown with the patient name, sex, age/date of birth, CR Number, and active-visit status when applicable.
  3. Search for a deliberately nonexistent unique name.
    - expect: No unrelated patient is displayed.
    - expect: The UI communicates that no matching patient was found or presents an empty-results state.
  4. Search again for Kenneth Carter and open the result.
    - expect: The patient chart opens on Patient summary.
    - expect: Clinical navigation is available, including Vitals & Biometrics, Medications, Orders, Results, Visits, Allergies, Conditions, Appointments, and Billing history.
  5. Select Record vitals or the Vitals Add action, enter clinically valid temperature, blood pressure, pulse, respiratory rate, oxygen saturation, weight, and height values, and save once.
    - expect: Required and numeric fields validate input before save; invalid or out-of-range text must not be silently recorded.
    - expect: On successful save, the new vitals appear in the patient summary/history with the entered values and current date/time.
    - expect: The page remains associated with Kenneth Carter and does not create or alter another patient record.

#### 1.4. Create, filter, and check in a scheduled appointment

**File:** `tests/openmrs-core-user-operations/appointments.spec.ts`

**Steps:**
  1. Start with a fresh authenticated session and open Appointments from Left navigation.
    - expect: The appointments workspace loads with the calendar, service-type filter, status filter, Filter table input, appointment table, and Create new appointment action.
  2. Select Create new appointment and choose an existing patient such as Kenneth Carter, an available service type/provider/location, and a future appointment date and time; submit the appointment once.
    - expect: The appointment creation flow loads rather than remaining indefinitely in a loading state.
    - expect: The form requires a patient and validates required scheduling fields.
    - expect: A success confirmation is displayed or the new appointment appears in the scheduled appointments table with patient, location, service type, time, and Scheduled status.
  3. Attempt to submit a second appointment with an omitted required value or invalid/past date.
    - expect: The appointment is not created.
    - expect: A clear field-level or form-level validation message explains the correction needed.
  4. Use the service-type, status, and text filters to locate the newly created appointment.
    - expect: Each filter narrows results according to its selected criterion.
    - expect: Clearing filters restores the broader appointment list.
  5. Use the row-level Check In action for the newly scheduled appointment and confirm the action if confirmation is requested.
    - expect: The appointment transitions from Scheduled to Checked in (or its configured equivalent).
    - expect: The updated status is visible in the table and summary counts reflect the state change.

#### 1.5. Create and track a laboratory test order through its result status

**File:** `tests/openmrs-core-user-operations/laboratory-orders.spec.ts`

**Steps:**
  1. Start with a fresh authenticated session and open Laboratory from Left navigation.
    - expect: The laboratory workspace shows Add test order, Tests ordered, date range controls, and order/worklist/result counts.
    - expect: The tests table shows patient, patient ID, urgency, age, sex, and total orders where data exists.
  2. Select Add test order and search for Kenneth Carter by name or CR Number 10001C6.
    - expect: The patient-search panel opens and returns the matching patient.
    - expect: Selecting the patient advances to a test-order form or equivalent order-entry workflow.
  3. Attempt to continue or submit without selecting a test or other mandatory order data.
    - expect: The incomplete order is blocked with clear validation feedback.
    - expect: No worklist or test-order count is incremented.
  4. Select an available laboratory test, specify valid required order details such as urgency and collection/order information, and submit once.
    - expect: A confirmation is shown or the patient appears in Tests ordered with the selected test/order count and urgency.
    - expect: The new order is associated only with the selected patient.
  5. Filter the Tests ordered view by a date range containing the new order, then progress or inspect the order in the Worklist and Results/Completed views according to the available demo actions.
    - expect: The date range includes the new order and excludes orders outside the selected range.
    - expect: Status-specific views accurately reflect the order's lifecycle; completed results are distinguishable from in-progress and declined tests.
    - expect: An unavailable result-entry action or a failed transition must produce an understandable state/error and must not falsely mark the test complete.

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseUrl: "http://btv-private-module-backend-logicloud-qa.apps.nonprod2-openshift-cluster.internal.logi-cloud.com/api/v1",
  baseUrl2: "http://btv-private-module-backend-logicloud-qa.apps.nonprod2-openshift-cluster.internal.logi-cloud.com/api/v1",
  baseUrl3: "http://btv-private-module-backend-logicloud-qa.apps.nonprod2-openshift-cluster.internal.logi-cloud.com/api/v1",
  baseUrl4: "http://btv-private-module-backend-logicloud-qa.apps.nonprod2-openshift-cluster.internal.logi-cloud.com/api/v1",
  // token: "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJPd25lclByaW5jaXBhbHtlbnRlcnByaXNlSUQ9J0JUVicsIGNvbXBhbnlJRD0nbnVsbCcsIG93bmVySUQ9J251bGwnLCB3bXNDb21wYW55SUQ9J251bGwnLCB1c2VySUQ9J2FwcHN1cHBvcnQnfSIsImF1dGgiOiJST0xFX1VTRVIiLCJvd25lciI6IntcImVudGVycHJpc2VJRFwiOlwiQlRWXCIsXCJjb21wYW55SURcIjpudWxsLFwib3duZXJJRFwiOm51bGwsXCJ3bXNDb21wYW55SURcIjpudWxsLFwidXNlcklEXCI6XCJhcHBzdXBwb3J0XCJ9IiwiZXhwIjoxNjk4MTc5NzM3fQ.1zvWAFdKUHal_JbJFzfBuGVAZOyrv69CL97qn8LCw92Ozv1XO0qgoE6HkaD1sv1740wcyJHYRI85EI_sQvimJA"
  token:localStorage.getItem('jwt')
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

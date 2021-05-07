import { expect } from "chai";
import {
  Authentication,
  PowerAppsConnection,
} from "../src/Authentication/Authentication";
import {
  AuthParamsPWD,
  EnvironmentDetails,
} from "../src/Runsettings.development";
import { createContacts } from "../src/FakeDataLoader";
import fetch from "node-fetch";

describe("PowerApps Load Tests", function () {
  let access_token: string;

  before(async () => {
    access_token = (await getTestAccessToken()).access_token;
  });

  it("Create 0 Fake Contacts", async function () {
    createContacts(0);
    // Check Status
  });

  it("Create 1 Fake Contacts", async function () {
    createContacts(1);
    // Check Status
  });

  let numBatches = 2;
  let batchCount = 10;

  // it(`POST ${numBatches * batchCount} BATCH /contacts`, async function () {
  //   let ownerId = "cd21d93b-6878-eb11-b1ab-000d3a598def";
  //   console.time("batch_total");

  //   let sum = 1;
  //   for (let i = 0; i < numBatches; i++) {
  //     const myHeaders: any = {
  //       "Content-Type": "multipart/mixed; boundary=batch_AAA123",
  //       "OData-Version": "4.0",
  //       "OData-MaxVersion": "4.0",
  //       "MSCRM.ReturnNotifications": "true",
  //       Connection: "keep-alive",
  //       Authorization: `Bearer ${access_token}`,
  //     };

  //     let batch = "--batch_AAA123\nContent-Type: multipart/mixed;";
  //     let boundary = "boundary=changeset_BBB456\n\n";
  //     let request: string = "";

  //     console.time(`batch_${i}`);
  //     for (let j = 1; j <= batchCount; j++) {
  //       request += `--changeset_BBB456\nContent-Type: application/http \nContent-Transfer-Encoding:binary \nContent-ID:${sum} \n\nPOST /api/data/v9.1/contacts HTTP/1.1\nContent-Type: application/json;type=entry\n\n{\"firstname\":\"A Batch\",\"lastname\":\"Number-${sum}\",\"ownerid@odata.bind\":\"/systemusers(${ownerId})\",\"parentcustomerid_account@odata.bind\":\"/accounts(3011d50c-e47d-eb11-a812-000d3a5a66d6)\"}\n`;
  //       sum++;
  //     }

  //     let endChangeSet = "--changeset_BBB456--";
  //     let endRequest = "\n\n--batch_AAA123--";

  //     batch += boundary + request + endChangeSet + endRequest;

  //     let requestOptions: any = {
  //       method: "POST",
  //       headers: myHeaders,
  //       body: batch as string,
  //       redirect: "follow",
  //     };
  //     let response = await fetch(
  //       `${EnvironmentDetails.org_url}/$batch`,
  //       requestOptions
  //     );

  //     if (response.status !== 200) {
  //       console.log(
  //         `${response.status} ${response.statusText} | ${response.url}`
  //       );
  //     }
  //     console.timeEnd(`batch_${i}`);
  //     expect(response.status).to.equal(200);

  //     if (sum && sum % batchCount == 0) {
  //       console.log(`Loaded: ${sum} test contacts`);
  //     }
  //   }
  //   console.timeEnd("batch_total");
  // });
});

export async function getTestAccessToken(): Promise<PowerAppsConnection> {
  let response: PowerAppsConnection = await Authentication.Instance.authenticate(
    AuthParamsPWD
  );

  expect(response.token_type).to.equal("Bearer");
  expect(response.access_token).to.exist;
  expect(response.refresh_token).to.exist;

  return response;
}

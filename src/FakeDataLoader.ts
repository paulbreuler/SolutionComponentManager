import faker from "faker";

export const batchFillLimit = 5;

export async function createContacts(contactCount: number) {
  let ownerId = "cd21d93b-6878-eb11-b1ab-000d3a598def";
  console.time("batch_total");

  let numBatches = Math.ceil(contactCount / batchFillLimit);
  let remainder = contactCount % batchFillLimit;

  console.log(`Batch Count = ${numBatches}`);
  console.log(`Remainder = ${remainder}`);

  let sum = 0;
  for (let i = 0; i < numBatches; i++) {
    // const myHeaders: any = {
    //   "Content-Type": "multipart/mixed; boundary=batch_AAA123",
    //   "OData-Version": "4.0",
    //   "OData-MaxVersion": "4.0",
    //   "MSCRM.ReturnNotifications": "true",
    //   Connection: "keep-alive",
    //   Authorization: `Bearer ${access_token}`,
    // };

    // let batch = "--batch_AAA123\nContent-Type: multipart/mixed;";
    // let boundary = "boundary=changeset_BBB456\n\n";
    // let request: string = "";

    console.time(`batch_${i}`);
    let loopLimit = batchFillLimit;
    if (i === numBatches - 1 && remainder !== 0) {
      loopLimit = remainder;
    }
    for (let j = 1; j <= loopLimit; j++) {
      // request += `--changeset_BBB456\nContent-Type: application/http \nContent-Transfer-Encoding:binary \nContent-ID:${sum} \n\nPOST /api/data/v9.1/contacts HTTP/1.1\nContent-Type: application/json;type=entry\n\n{\"firstname\":\"A Batch\",\"lastname\":\"Number-${sum}\",\"ownerid@odata.bind\":\"/systemusers(${ownerId})\",\"parentcustomerid_account@odata.bind\":\"/accounts(3011d50c-e47d-eb11-a812-000d3a5a66d6)\"}\n`;
      sum++;
      console.log(sum);
    }

    // let endChangeSet = "--changeset_BBB456--";
    // let endRequest = "\n\n--batch_AAA123--";

    // batch += boundary + request + endChangeSet + endRequest;

    // let requestOptions: any = {
    //   method: "POST",
    //   headers: myHeaders,
    //   body: batch as string,
    //   redirect: "follow",
    // };
    // let response = await fetch(
    //   `${EnvironmentDetails.org_url}/$batch`,
    //   requestOptions
    // );

    // if (response.status !== 200) {
    //   console.log(
    //     `${response.status} ${response.statusText} | ${response.url}`
    //   );
    // }
    console.timeEnd(`batch_${i}`);

    if (sum && sum % contactCount == 0) {
      console.log(`Generated: ${sum} test contacts`);
    }
  }
  console.log(`Summation = ${sum}`);
  console.timeEnd("batch_total");
}

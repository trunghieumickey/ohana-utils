document.addEventListener('DOMContentLoaded', (event) => {
    // Set default values
    setDefaultValues();

    const inputs = document.querySelectorAll('#main-container');
    inputs.forEach(input => {
        input.addEventListener('change', compileAndShow);
    });
    compileAndShow(); // Populate details on page load
});

function infoCount(){
    return document.getElementById('infos-container').childElementCount+1;
}

function setDefaultValues() {
    // Create a new Date object for the current time
    const now = new Date();
    // Adjust to local timezone and format to YYYY-MM-DDTHH:MM
    let year = now.getFullYear();
    let month = ('0' + (now.getMonth() + 1)).slice(-2); // Months are 0-based
    let day = ('0' + now.getDate()).slice(-2);
    let hours = ('0' + now.getHours()).slice(-2);
    let minutes = ('0' + now.getMinutes()).slice(-2);
    const datetimeLocal = `${year}-${month}-${day}T${hours}:${minutes}`;
    document.getElementById('datetime').value = datetimeLocal;

    // Set default values for other inputs
    document.getElementById('guildname').value = 'Ohana'; // Example default value
    document.getElementById('server').value = 'O1'; // Example default value
    document.getElementById('rotation').value = 'Puturum → Ferrid → Mudster → CTG Khan'; // Example default value
}

function addInfoField() {
    if (infoCount() < 6) {
        const container = document.getElementById('infos-container');
        const newDiv = document.createElement('div');
        newDiv.className = 'container';
        newDiv.innerHTML = `<label for="infos-${infoCount()}">Additional Info ${infoCount()}:</label><input type="text" id="infos-${infoCount()}" placeholder="Enter more details...">`;
        container.appendChild(newDiv);
        compileAndShow(); // Update output on adding a field
    }
}

function removeInfoField() {
    if (infoCount() > 1) {
        const container = document.getElementById('infos-container');
        container.removeChild(container.lastChild);
        compileAndShow(); // Update output on removing a field
    }
}

function compileAndShow() {
    const addButton = document.querySelector('button[onclick="addInfoField()"]');
    const removeButton = document.querySelector('button[onclick="removeInfoField()"]');
    const datetime = document.getElementById('datetime').value;
    const invtime = document.getElementById('invtime').value;
    const server = document.getElementById('server').value;
    const rotation = document.getElementById('rotation').value;
    const guildname = document.getElementById('guildname').value;
    const contact = document.getElementById('contact').value;
    const passcode = document.getElementById('passcode').value;
    const slots = document.getElementById('slots').value;

    // Convert datetime to Unix timestamp in UTC
    const datetimeUTC = new Date(datetime).getTime() / 1000; // getTime() returns milliseconds
    const invtimeUTC = invtime ? new Date(datetime.split('T')[0] + 'T' + invtime).getTime() / 1000 : null;

    var details = `@here`;
    details += `\n# ${guildname}`
    details += `\n- <t:${datetimeUTC}:F> @ ${server}`
    details += `\n- ${rotation}`
    if (contact) {
        details += `\n- Contact: ${contact.match(/[\p{L}\p{N}]+/gu).join(', ')}`
    }
    if (slots) {
        details += `\n- Slots: ${slots}`;
    }
    if (invtime) {
        details += `\n- Start invite at <t:${invtimeUTC}:t>`;
    }
    if (passcode) {
        details += `\n- Password: "**${passcode.replace(/<([^>]+)>/g, "[$1](https://trunghieumickey.github.io/ohana-utils/gbr-form.html)")}**"`;
    }
    for (let i = 0; i < infoCount(); i++) {
        const infoValue = document.getElementById(`infos-${i}`);
        if (infoValue && infoValue.value) {
            details += `\n- ${infoValue.value}`;
        }
    }
    document.getElementById('output').value = details;
    addButton.disabled = infoCount() >= 6;
    removeButton.disabled = infoCount() <= 1;
}

function copyToClipboard() {
    const outputText = document.getElementById('output');
    outputText.select();
    outputText.setSelectionRange(0, 99999); // For mobile devices
    document.execCommand('copy');
    alert('Copied to clipboard');
}
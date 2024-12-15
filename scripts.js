

async function validateHTML(url) {
    const validator = "https://validator.w3.org/nu/";
    const params = new URLSearchParams({
        doc: url,
        out: 'json'
    });

    try {
        const response = await fetch(`${validator}?${params}`);
        if (response.ok) {
            const data = await response.json();
            const errors = data.messages.filter(message => message.type === "error");
            return errors.length === 0 ? "Valid HTML" : `${errors.length} HTML errors found`;
        }
        return `Failed to validate HTML (${response.status})`;
    } catch (error) {
        return `Error validating HTML: ${error.message}`;
    }
}

async function validateCSS(url) {
    const validator = "https://jigsaw.w3.org/css-validator/validator";
    const params = new URLSearchParams({
        uri: url,
        profile: 'css3',
        output: 'json'
    });

    try {
        const response = await fetch(`${validator}?${params}`);
        if (response.ok) {
            const data = await response.json();
            if (data.cssvalidation.validity) {
                return "Valid CSS";
            }
            return `${data.cssvalidation.errors.length} CSS errors found`;
        }
        return `Failed to validate CSS (${response.status})`;
    } catch (error) {
        return `Error validating CSS: ${error.message}`;
    }
}

async function startValidation() {
    const urlInput = document.getElementById('urlInput');
    const validateBtn = document.getElementById('validateBtn');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const resultsDiv = document.getElementById('results');

    const urls = urlInput.value.split('\n').filter(url => url.trim());

    if (urls.length === 0) {
        alert('Please enter at least one URL');
        return;
    }

    validateBtn.disabled = true;
    loadingIndicator.style.display = 'inline-block';
    resultsDiv.innerHTML = '';

    for (const url of urls) {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        resultItem.innerHTML = `
            <h3>${url}</h3>
            <p id="html-${url}">HTML: Validating...</p>
            <p id="css-${url}">CSS: Validating...</p>
        `;
        resultsDiv.appendChild(resultItem);

        try {
            const htmlResult = await validateHTML(url);
            const cssResult = await validateCSS(url);

            document.getElementById(`html-${url}`).innerHTML =
                `HTML: <span class="${htmlResult.includes('Valid') ? 'valid' : 'error'}">${htmlResult}</span>`;
            document.getElementById(`css-${url}`).innerHTML =
                `CSS: <span class="${cssResult.includes('Valid') ? 'valid' : 'error'}">${cssResult}</span>`;
        } catch (error) {
            resultItem.innerHTML += `<p class="error">Error: ${error.message}</p>`;
        }
    }

    validateBtn.disabled = false;
    loadingIndicator.style.display = 'none';
}
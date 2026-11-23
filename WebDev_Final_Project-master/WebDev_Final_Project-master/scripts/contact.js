const envelope = document.querySelector('#envelope');
const letter = document.querySelector('#letter');
const placeholder = document.querySelector('#letter-placeholder');
const dialog = document.querySelector('#letter-dialog');
const form = document.querySelector('#contact-form');
const openButton = document.querySelector('#open-letter');
const closeButton = document.querySelector('#close-letter');
const mailStatus = document.querySelector('#mail-status');
const instruction = document.querySelector('#mail-instruction');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let letterNumber = 1;
let sending = false;

openButton.addEventListener('click', () => {
    if (dialog.open || sending) return;
    const origin = letter.getBoundingClientRect();
    envelope.classList.remove('is-fresh');
    envelope.classList.add('is-open');
    placeholder.hidden = false;
    // Move the actual letter into the top-layer dialog, keeping its draft and
    // a placeholder in the envelope so opening never extends the page.
    dialog.append(letter);
    form.inert = false;
    openButton.setAttribute('aria-expanded', 'true');
    document.documentElement.classList.add('letter-modal-open');
    dialog.showModal();
    const target = dialog.getBoundingClientRect();
    dialog.style.setProperty('--letter-start-x', `${origin.left + origin.width / 2 - target.left - target.width / 2}px`);
    dialog.style.setProperty('--letter-start-y', `${origin.top + origin.height / 2 - target.top - target.height / 2}px`);
    dialog.classList.add('is-arriving');
    form.querySelector('#name').focus({ preventScroll: true });
    dialog.scrollTop = 0;
    instruction.textContent = 'Your next chapter starts here.';
    mailStatus.textContent = 'Fill in your letter, then submit to reveal a fresh card.';
});

function closeDraft() {
    if (sending) return;
    mailStatus.textContent = 'Your draft is still in the envelope. Click to keep writing.';
    dialog.close();
}

closeButton.addEventListener('click', closeDraft);
dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeDraft();
});
dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) {
        closeDraft();
    }
});
dialog.addEventListener('close', () => {
    envelope.insertBefore(letter, placeholder);
    placeholder.hidden = true;
    form.inert = true;
    envelope.classList.remove('is-open');
    dialog.classList.remove('is-arriving', 'is-sending');
    document.documentElement.classList.remove('letter-modal-open');
    openButton.setAttribute('aria-expanded', 'false');
    openButton.focus({ preventScroll: true });
});

form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (sending || !form.reportValidity()) return;
    sending = true;
    closeButton.disabled = true;
    form.querySelectorAll('button').forEach((button) => { button.disabled = true; });
    dialog.classList.remove('is-arriving');
    dialog.classList.add('is-sending');
    mailStatus.textContent = 'Folding this letter away…';

    window.setTimeout(() => {
        // This is a local interaction only: do not transmit or persist form data.
        form.reset();
        dialog.close();
        form.querySelectorAll('button').forEach((button) => { button.disabled = false; });
        closeButton.disabled = false;
        envelope.classList.add('is-fresh');
        document.querySelector('#letter-number').textContent = String(++letterNumber).padStart(3, '0');
        instruction.textContent = 'A fresh letter. A brand-new beginning.';
        mailStatus.textContent = 'Your card was cleared, not sent. A fresh letter is ready to open.';
        sending = false;
    }, reducedMotion.matches ? 0 : 700);
});

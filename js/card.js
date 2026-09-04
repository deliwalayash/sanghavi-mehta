/**
 * Digital Visiting Card Interactive Script
 * Sanghvi Sales Corporation & Mehta Enterprise
 */

const CONTACT_DATA = {
    vinubhai: {
        name: "Virendrabhai (Vinubhai) Sanghvi",
        firstName: "Virendrabhai",
        lastName: "Sanghvi",
        nickName: "Vinubhai",
        title: "Partner",
        organization: "Sanghvi Sales Corporation & Mehta Enterprise",
        phone: "+919374710607",
        phoneFormatted: "+91 93747 10607",
        email: "sanghvimehta@yahoo.com",
        address: {
            street: "Sanghvi House, Rd No. 4, Udhana GIDC",
            city: "Surat",
            state: "Gujarat",
            postalCode: "394210",
            country: "India"
        },
        website: "https://sanghvisalesmehta.com/",
        note: "Authorized Stockist: Taparia Hand Tools (BS-802), Rathi Lovejoy Couplings, Astral Pipes, Dutron Suction Hoses, Fenner Industrial Belts.",
        cardUrl: "card-vinubhai.html"
    },
    chiragbhai: {
        name: "Chiragbhai Sanghvi",
        firstName: "Chiragbhai",
        lastName: "Sanghvi",
        nickName: "Chiragbhai",
        title: "Partner",
        organization: "Sanghvi Sales Corporation & Mehta Enterprise",
        phone: "+919825760022",
        phoneFormatted: "+91 98257 60022",
        email: "sanghvimehta@yahoo.com",
        address: {
            street: "Sanghvi House, Rd No. 4, Udhana GIDC",
            city: "Surat",
            state: "Gujarat",
            postalCode: "394210",
            country: "India"
        },
        website: "https://sanghvisalesmehta.com/",
        note: "Authorized Stockist: Taparia Hand Tools (BS-802), Rathi Lovejoy Couplings, Astral Pipes, Dutron Suction Hoses, Fenner Industrial Belts.",
        cardUrl: "card-chiragbhai.html"
    }
};

/**
 * Generate and trigger vCard (.vcf) download for mobile contact saving
 */
function downloadVCard(personKey) {
    const person = CONTACT_DATA[personKey];
    if (!person) return;

    const vCardData = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `N:${person.lastName};${person.firstName};;;`,
        `FN:${person.name}`,
        `ORG:${person.organization}`,
        `TITLE:${person.title}`,
        `TEL;TYPE=CELL,VOICE,PREF:${person.phone}`,
        `EMAIL;TYPE=WORK,INTERNET:${person.email}`,
        `ADR;TYPE=WORK:;;${person.address.street};${person.address.city};${person.address.state};${person.address.postalCode};${person.address.country}`,
        `URL:${person.website}`,
        `NOTE:${person.note}`,
        "END:VCARD"
    ].join("\r\n");

    const blob = new Blob([vCardData], { type: "text/vcard;charset=utf-8;" });
    const fileName = `${person.firstName}_${person.lastName}_Sanghvi_Sales.vcf`;

    if (navigator.msSaveBlob) {
        // IE 10+
        navigator.msSaveBlob(blob, fileName);
    } else {
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", fileName);
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setTimeout(() => URL.revokeObjectURL(url), 1000);
            showToast("Contact card downloaded! Tap to add to Phone Contacts.");
        }
    }
}

/**
 * Native Web Share API or copy link fallback
 */
async function shareCard(personKey) {
    const person = CONTACT_DATA[personKey];
    if (!person) return;

    const fullUrl = window.location.href;
    const shareData = {
        title: `${person.name} | ${person.organization}`,
        text: `Digital Visiting Card of ${person.name} (${person.title}) - ${person.organization}, Surat`,
        url: fullUrl
    };

    if (navigator.share) {
        try {
            await navigator.share(shareData);
        } catch (err) {
            if (err.name !== "AbortError") {
                copyToClipboard(fullUrl, "Card link copied to clipboard!");
            }
        }
    } else {
        copyToClipboard(fullUrl, "Card link copied to clipboard!");
    }
}

/**
 * Copy text to clipboard and show toast
 */
function copyToClipboard(text, customMessage) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            showToast(customMessage || "Copied to clipboard!");
        }).catch(() => {
            fallbackCopyText(text, customMessage);
        });
    } else {
        fallbackCopyText(text, customMessage);
    }
}

function fallbackCopyText(text, customMessage) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        document.execCommand('copy');
        showToast(customMessage || "Copied to clipboard!");
    } catch (err) {
        showToast("Unable to copy. Please copy manually.");
    }
    document.body.removeChild(textArea);
}

/**
 * Toast Notification Popup
 */
let toastTimeout;
function showToast(message) {
    let toast = document.getElementById("customToast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "customToast";
        toast.className = "custom-toast";
        document.body.appendChild(toast);
    }

    toast.innerHTML = `<i class="fa-solid fa-circle-check text-green-accent"></i> <span>${message}</span>`;
    toast.classList.add("show");

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove("show");
    }, 3200);
}

/**
 * Open QR Code Modal
 */
function openQRModal(personKey) {
    const person = CONTACT_DATA[personKey];
    if (!person) return;

    const qrImg = document.getElementById("qrCodeImage");
    const qrName = document.getElementById("qrModalName");
    const currentUrl = encodeURIComponent(window.location.href);

    if (qrImg) {
        qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=10&data=${currentUrl}`;
    }
    if (qrName) {
        qrName.textContent = person.name;
    }

    const qrModalElem = document.getElementById("qrModal");
    if (qrModalElem && window.bootstrap) {
        const modal = new bootstrap.Modal(qrModalElem);
        modal.show();
    }
}

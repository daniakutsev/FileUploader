function bytesToSize(bytes) {
    const sizes = ['B', 'K', 'M', 'G', 'T', 'P']
    for (let i = 0; i < sizes.length; i++) {
        if (bytes <= 1024) {
            return bytes + ' ' + sizes[i]
        } else {
            bytes = parseFloat(bytes / 1024).toFixed(2)
        }
    }
    return bytes + ' P';
}

const createElement = (tag, classes = [], content) => {
    const node = document.createElement(tag)
    if (classes.length) {
        node.classList.add(...classes)
    }
    if (content) {
        node.textContent = content
    }
    return node
}

export function upload(selector, options = {}) {
    let files = []
    const onUpload = options.onUpload ?? nope
    const nope = () => {
    }
    const input = document.querySelector(selector)

    const preview = createElement('div', ['preview'])
    const open = createElement('button', ['btn'], 'Open')
    const upload = createElement('button', ['btn', 'primary'], 'Upload')
    upload.style.display = 'none'

    if (options.multi) {
        input.setAttribute('multiple', true)
    }
    if (options.accept) {
        input.setAttribute('accept', options.accept)
    }

    input.insertAdjacentElement('afterend', preview)
    input.insertAdjacentElement('afterend', upload)
    input.insertAdjacentElement('afterend', open)
    const triggerInput = () => input.click()
    const changeHandler = event => {
        if (!event.target.files.length) return

        files = Array.from(event.target.files)
        preview.innerHTML = ''
        upload.style.display = 'inline'
        files.forEach(file => {
            if (!file.type.match('image')) return

            const reader = new FileReader()

            reader.onload = ev => {
                const src = ev.target.result
                preview.insertAdjacentHTML('afterbegin', `
                  <div class="preview-image">
                      <div class="preview-remove" data-name="${file.name}">&times;</div>
                      <img src="${src}" alt="${file.name}" />
                      <div class="preview-info">
                          <span>${file.name}</span>
                          ${bytesToSize(file.size)}
                       </div>
                  </div>`)
            }

            reader.readAsDataURL(file)
        })

    }

    const removeHandler = event => {
        if (!event.target.dataset.name) return
        const {name} = event.target.dataset
        files = files.filter(file => file.name !== name)
        if (!files.length) {
            upload.style.display = 'none'
        }
        const block = preview.querySelector(`[data-name="${name}"]`)
            .closest('.preview-image')

        block.classList.add('removing')
        setTimeout(() => block.remove(), 300)

    }
    const clearPreview = el => {
        el.style.bottom = '4px'
        el.innerHTML = '<div class="preview-info-progress"></div>'
    }
    const uploadHandler = () => {
        preview.querySelectorAll('.preview-remove').forEach(e => e.remove())
        const previewInfo = preview.querySelectorAll('.preview-info')
        previewInfo.forEach(clearPreview)
        onUpload(files, previewInfo)
    }


    open.addEventListener('click', triggerInput)
    input.addEventListener('change', changeHandler)
    preview.addEventListener('click', removeHandler)
    upload.addEventListener('click', uploadHandler)
}
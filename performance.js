let input = document.querySelector(".wrap__input")

input.onkeyup = ((e)=>{
    let d=debounce(Options,1000)
    d(e)
})


function debounce(fn,time){
    let timer
    return function (...args){
        clearTimeout(timer)
        timer=setTimeout(()=>{
            fn.apply(this,args)
        },time)
    }
}
async function Options(text) {
    let t = `${text.target.value}`
    const api = new Api()
    const addOption = new AddOptions(".wrap__autocomplite__inner")


        if (text.target.value !== "" && /^[a-zA-Z]+$/.test(text.target.value)) {
            if (text.key !== "Backspace") {
                let {items} = await api.Get(text.target.value)
                addOption.add(items)
            } else {
                addOption.reset()
                let {data} = await api.Get(t)
                addOption.add(data.items)
            }
        }
}

class AddOptions {
    constructor(query) {
        this.query = document.querySelector(query)
    }

    add(data) {
        console.log(data);
        data.forEach(element => {
            const option = document.createElement("div");
            option.innerText = element.name;
            option.classList.add("wrap__autocomplite__list")
            option.onclick = (() => {
                this.onClickOptions(element.name, element.owner.login, element.stargazers_count, element.id)
            })
            this.query.appendChild(option);
        })
    }

    reset() {
        input.value=""
        while (this.query.firstChild) {
            this.query.removeChild(this.query.firstChild)
        }
    }

    onClickOptions(name, owner, stars, id) {
        const wrapBoxInfo = document.createElement("div")
        wrapBoxInfo.classList.add("wrap__box__items")
        wrapBoxInfo.id=id
        wrapBoxInfo.innerHTML = `
                <div class="wrap__box__info">
                    <ul class="wrap__box__list">
                        <li>name: ${name}</li>
                        <li>Owner: ${owner}</li>
                        <li>Stars: ${stars}</li>
                    </ul>
                </div>
                <div " class="wrap__box__remove">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                        <line x1="10" y1="10" x2="90" y2="90" stroke="red" stroke-width="5"/>
                        <line x1="10" y1="90" x2="90" y2="10" stroke="red" stroke-width="5"/>
                    </svg>
                </div>`
        document.querySelector(".wrap__box").appendChild(wrapBoxInfo)
        document.querySelectorAll(".wrap__box__remove").forEach(el=>{
            el.onclick=(()=>{
                this.remove(id)
            })
        })
        this.reset()
    }

    remove(e) {
        document.getElementById(e).remove()
    }
}


class Api {
    async Get(text) {
        try {
            const response = await fetch(`https://api.github.com/search/repositories?q=${text}&per_page=5`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'Authorization': 'Bearer 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',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }
}



/**
 * Criando seletores simplificado
 * @param el 
 */
let cart = [];
let modalQt = 1;
let modalKey = 0;


const slct = (el) => document.querySelector(el);

const slctAll = (el) => document.querySelectorAll(el);

/**
 * Mapeando o JSON com as pizzas em lista
 */
pizzaJson.map((item, index) => {
    //Clonando o HTML para inserir as pizzas uma a uma
    let pizzaItem = slct('.models .pizza-item').cloneNode(true);

    //Preencher com os dados das pizzas no campo correto
    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price[2].toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;



    //Ação de abertura do Modals para adicionar ao carrinho
    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();

        //Criando a variável key para selção do index dos array/obj
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQt = 1;
        modalKey = key;

        //Selecionando os datos para apresentação no Modal
        slct('.pizzaBig img').src = pizzaJson[key].img;
        slct('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price[2].toFixed(2)}`;
        slct('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        slct('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;

        //Removendo a seleção padrão setada no HTML
        slct('.pizzaInfo--size.selected').classList.remove('selected');

        //Inserindo os tamanhos das pizzas com ForEach e SelectAll
        slctAll('.pizzaInfo--size').forEach((size, sizeIndex) => {

            //Inserindo a seleção por padrão no tamanho da Pizza
            if (sizeIndex == 2) {
                size.classList.add('selected');
            }

            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

        slctAll(".pizzaInfo--size").forEach((size) => {
            size.addEventListener('click', () => {
                slct('.pizzaInfo--size.selected').classList.remove('selected');
                size.classList.add('selected');
                slct(".pizzaInfo--actualPrice").innerHTML = `R$ ${pizzaJson[key].price[size.getAttribute('data-key')].toFixed(2)}`;
            });
        });


        slct('.pizzaInfo--qt').innerHTML = modalQt;

        //Realizando a abertura do modal com efeito de opacidade
        slct('.pizzaWindowArea').style.opacity = 0;
        slct('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() => {
            slct('.pizzaWindowArea').style.opacity = 1;
        }, 200);
    });

    //Preencher com a classe clonada
    slct('.pizza-area').append(pizzaItem);
});

/**
 * EVENTOS DE FUNCIONAMENTO DO MODAL
 */
function closeModal() {
    slct('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        slct('.pizzaWindowArea').style.display = 'none';
    }, 500);
}

//Fechar o modal com o click no cancelar e no voltar
slctAll('.pizzaInfo--cancelMobileButton, .pizzaInfo--cancelButton').forEach((item) => {
    item.addEventListener('click', closeModal);
});

// Diminuindo a quantidade de pizzas e validando o mínimo padrão para exibição
slct('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if (modalQt > 1) {
        modalQt--;
        slct('.pizzaInfo--qt').innerHTML = modalQt;
    }
});

// Aumentando a quantidade de pizzas
slct('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQt++;
    slct('.pizzaInfo--qt').innerHTML = modalQt;
});

// Selecionando outros tamanhos
slctAll('.pizzaInfo--size').forEach((size, sizeIndex) => {
    size.addEventListener('click', (e) => {
        slct('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});


/**
 * AÇÃO QUE ADICIONA ITENS AO CARRINHO
 */
slct('.pizzaInfo--addButton').addEventListener('click', () => {
    //Identifica o tamanho selecionado da Pizza
    let size = parseInt(slct('.pizzaInfo--size.selected').getAttribute('data-key'));

    //Cria um identificador que será possível validar a existência no carrinho
    let identifier = pizzaJson[modalKey].id + '@' + size;

    //Busca quais são os indices que correspondem ao Identificador acima dentro do carrinho
    let key = cart.findIndex((item) => item.identifier == identifier);

    //Executa a verificação dentro do carrinho e adiciona a quantidade quando houver OU
    if (key > -1) {
        cart[key].qt += modalQt;
    } else {
        //Cria o item caso não exista
        cart.push({
            identifier,
            id: pizzaJson[modalKey].id,
            size,
            qt: modalQt
        });
    }

    // Atualiza o carrinho
    updateCart();

    // Fecha o Modal para que o usuário possa continuar navegando pelo site
    closeModal();
});

slct('.menu-openner').addEventListener('click', () => {
    if (cart.length > 0) {
        slct('aside').style.left = "0";
    }
});

slct('.menu-closer').addEventListener('click', () => {
    slct('aside').style.left = "100vw";
});

/**
 * FUNCAO DE ATUALIZAÇÃO DO CARRINHO
 */
function updateCart() {
    slct('.menu-openner span').innerHTML = cart.length;

    if (cart.length > 0) {
        //Abre o carrinho assim que adiciona a pizza ao carrinho
        slct('aside').classList.add('show');

        //Sempre zerar antes de trazer a listagem das pizzas adicionadas ao carrinho
        slct('.cart').innerHTML = '';

        //Definindo as variáveis finais
        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        //Looping de verificação de existência e inserção no carrinho
        for (let i in cart) {
            let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
            let pz = cart[i].size;
            subtotal += pizzaItem.price[pz] * cart[i].qt;

            //Clonando o HTML do carrinho para criar as pizzas no carrinho
            let cartItem = slct('.models .cart--item').cloneNode(true);

            //Switch para renomar o tamanho da pizza no carrinho
            let pizzaSizeName;
            switch (pz) {
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;
            }
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            //Inserindo os dados dos itens no carrinho
            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if (cart[i].qt > 1) {
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1);
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt++;
                updateCart();
            });

            //Ação que trás o item no carrinho
            slct('.cart').append(cartItem);
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        slct('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        slct('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        slct('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    } else {
        //Fecha o carrinho assim que não existem mais itens
        slct('aside').classList.remove('show');
        slct('aside').style.left = "100vw";
    }
}
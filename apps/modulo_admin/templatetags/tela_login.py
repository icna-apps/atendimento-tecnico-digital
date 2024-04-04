from django import template
register = template.Library()
from django.utils.safestring import mark_safe
from django.templatetags.static import static

@register.simple_tag
def tela_login(imagem, legenda):
    imagem_path = static(imagem)
    logo_path = static('assets\logos\cna_arado.svg')
    
    html_content = f"""
        <div class="container_login">
            
            <!-- Imagem -->
            <div class="image-section">
                <img src="{imagem_path}" alt="Imagem do SisDAF">
                <div class="legenda-imagem">
                    <p>{legenda['titulo']}</p>
                    <p>{legenda['data']}</p>
                    {legenda['fotografo']}
                </div>
            </div>



            <!-- Seção de Login -->
            <div class="login-section">

                <!-- Logo -->
                <div class="logo-sistema">
                    <img src="{logo_path}" alt="Logo CNA">
                    <h1><span class="titulo-cna">cna</span><span class="titulo-digital">digital</span></h1>
                </div>
                
                <!-- Módulo -->
                <div class="modulo">
                    Módulo Técnico
                </div>
                
                <!-- Form Login -->
                <div class="form-login">
                    <!-- <form action="" method="POST"> -->
                        
                        <div class="credenciais">
                            <div class="form-floating mb-3">
                                <input type="text" class="form-control" id="cpf" placeholder="CPF">
                                <label for="cpf">CPF</label>
                            </div>
                            <div class="form-floating mb-3">
                                <input type="password" class="form-control" id="senha" placeholder="Senha">
                                <label for="senha">Senha</label>
                            </div>                      
                        </div>
                        <!-- <button type="submit">Entrar</button> -->
                        <button onclick="window.location.href = '/tecnico/dashboard'">Entrar</button>
                        
                    <!-- </form> -->
                </div>

                <!-- Realizar cadastro -->
                <div class="cadastrar" onclick="location.href='/cadastro'">
                    Cadastrar
                </div>
                
                
            </div>
            
        </div>
    """
    return mark_safe(html_content)
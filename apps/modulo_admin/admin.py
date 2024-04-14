from django.contrib import admin
from apps.modulo_admin.models import Usuario, UF_Municipio, VinculoTecnicoRegional

class ListandoUsuario(admin.ModelAdmin):
    list_display = ("cpf", "nome_completo", "data_nascimento", "sexo", "uf_municipio", "usuario_is_ativo")
    list_display_links = ("cpf", "nome_completo")
    search_fields = ("cpf", "nome_completo")
    list_filter = ("sexo", "usuario_is_ativo"  )
    list_per_page = 100

    def get_search_results(self, request, queryset, search_term):
        queryset, use_distinct = super(ListandoUsuario, self).get_search_results(request, queryset, search_term)
        if search_term:
            # Filtra o queryset pela UF correspondente ao termo de busca.
            # Isso assume que você pode obter a UF diretamente ou através do `reside_cod_ibge`
            uf_query = UF_Municipio.objects.filter(uf_sigla__iexact=search_term).values_list('cod_ibge', flat=True)
            queryset |= self.model.objects.filter(reside_cod_ibge__in=uf_query)
        return queryset, use_distinct

class ListandoVinculoTecnicoRegional(admin.ModelAdmin):
    list_display = ("usuario", "regional", "data_inicio", "data_fim", "is_ativo")
    list_display_links = ("usuario", "regional")
    search_fields = ("usuario__nome_completo", "regional")
    list_filter = ("is_ativo", "regional")
    list_per_page = 100

admin.site.register(Usuario, ListandoUsuario)
admin.site.register(VinculoTecnicoRegional, ListandoVinculoTecnicoRegional)
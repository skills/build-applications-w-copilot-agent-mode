{%- set all_passed = (results_table | selectattr("passed") | length) == (results_table | length) %}

{%- if all_passed %}

## Etapa {{ step_number }} — concluída ✅

{%- else %}

## Etapa {{ step_number }} — precisa de ajustes ❌

{%- endif %}

{%- if not all_passed %}
Algumas verificações falharam. Confira os resultados abaixo, corrija os problemas e tente novamente.
{%- endif %}

| Status | Verificação |
| ------ | ----------- |

{%- for row in results_table %}
| {% if row.passed -%}✅ Aprovada{%- else -%}❌ Falhou{%- endif %} | {{ row.description }} |
{%- endfor %}

{%- if tips and tips.length %}

### Dicas

{%- for tip in tips %}

- {{ tip }}
  {%- endfor %}

{%- endif %}

<!-- skills-step-feedback -->

{%- set all_passed = (results_table | selectattr("passed") | length) == (results_table | length) %}

## Step {{ step_number }} - {% if all_passed %}Passed ✅{% else %}Fail ❌{% endif %}

{% if not all_passed %}
Some checks failed. Review the results and the step's **Having trouble?** section, then push another change.
{% endif %}

| Status | Description |
| ------ | ----------- |
{%- for row in results_table %}
| {% if row.passed -%}✅ Pass{%- else -%}❌ Fail{%- endif %} | {{ row.description }} |
{%- endfor %}

import matplotlib.pyplot as plt

# Data for the ERP impact graph specific to ECAM's context
modules = ['Manufacturing', 'Accounting & Finance', 'Sales & Marketing', 'Human Resources']
before_erp_impact = [50, 60, 55, 45]  # Hypothetical values representing effectiveness before ERP implementation
after_erp_impact = [90, 85, 80, 75]  # Hypothetical values representing improvement after ERP implementation

# Creating the bar graph
plt.figure(figsize=(10,6))

# Plotting the before and after ERP data
plt.barh(modules, before_erp_impact, color='lightcoral', label='Before ERP Implementation', alpha=0.7)
plt.barh(modules, after_erp_impact, color='skyblue', label='After ERP Implementation', alpha=0.7)

# Adding labels and title
plt.xlabel('Impact on Key Business Areas (Percentage)')
plt.title('ERP System Impact on ECAM\'s Key Business Areas')

# Inverting y-axis for better readability
plt.gca().invert_yaxis()

# Adding legend
plt.legend()

# Display the graph
plt.show()

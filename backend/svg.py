import xml.etree.ElementTree as ET

# Load SVG
tree = ET.parse(r"output.svg")
root = tree.getroot()

# SVG namespace
ns = {"svg": "http://www.w3.org/2000/svg"}

# Find the element by id
element_to_remove = root.find(".//*[@id='etXfsAbEUD221']", ns)

if element_to_remove is not None:
    # Find the parent manually (iterate through all elements)
    for parent in root.iter():
        if element_to_remove in list(parent):
            parent.remove(element_to_remove)
            break

# Save modified SVG
tree.write("output.svg")
print("Element removed successfully!")

import json

def read_json_file(file_path):
    with open(file_path, 'r') as file:
        data = json.load(file)
    return data

def create_paragraph(data, indent=4, depth=0):
    paragraph = ""
    for key, value in data.items():
        paragraph += " " * indent * depth + f"{key}: "
        if isinstance(value, dict):
            paragraph += "\n" + create_paragraph(value, indent, depth + 1)
        elif isinstance(value, list) and all(isinstance(item, dict) for item in value):
            paragraph += "\n"
            for index, item in enumerate(value):
                paragraph += f" " * indent * (depth + 1) + f"[{index + 1}]:\n"
                paragraph += create_paragraph(item, indent, depth + 2)
        else:
            paragraph += f"{value}\n"
    return paragraph

def main():
    file_path = '/Users/jv/Downloads/Paytron Slack export Mar 28 2023 - Apr 3 2023/mpdm-christine.lo--carissa.tan--sarah.yancey--taria.lanham-1/2023-03-30.json'  # Replace with your JSON file path
    data = read_json_file(file_path)
    readable_output = create_paragraph(data)
    print(readable_output)

    with open('output.txt', 'w') as output_file:
        output_file.write(readable_output)

if __name__ == "__main__":
    main()

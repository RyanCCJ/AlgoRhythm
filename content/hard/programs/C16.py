class FileNode:
    def __init__(self):
        self.is_file = False
        self.children = {}
        self.content = ""

class FileSystem:
    def __init__(self):
        self.root = FileNode()
    
    def ls(self, path: str) -> list[str]:
        node = self.root
        
        if path != "/":
            parts = path.split("/")[1:]
            for part in parts:
                node = node.children[part]
        
        if node.is_file:
            return [path.split("/")[-1]]
        
        return sorted(node.children.keys())
    
    def mkdir(self, path: str) -> None:
        node = self.root
        parts = path.split("/")[1:]
        
        for part in parts:
            if part not in node.children:
                node.children[part] = FileNode()
            node = node.children[part]
    
    def add_content_to_file(self, file_path: str, content: str) -> None:
        node = self.root
        parts = file_path.split("/")[1:]
        
        for part in parts[:-1]:
            if part not in node.children:
                node.children[part] = FileNode()
            node = node.children[part]
        
        file_name = parts[-1]
        if file_name not in node.children:
            node.children[file_name] = FileNode()
        
        file_node = node.children[file_name]
        file_node.is_file = True
        file_node.content += content
    
    def read_content_from_file(self, file_path: str) -> str:
        node = self.root
        parts = file_path.split("/")[1:]
        
        for part in parts:
            node = node.children[part]
        
        return node.content
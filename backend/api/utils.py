from github import Github
from .models import Project
import requests

# GitHub personal access token
GITHUB_TOKEN = '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'

def generate_project_summary(project_id):
    try:
        # Fetch the project
        project = Project.objects.get(id=project_id)

        # Fetch related todos
        todos = project.todos.all()

        # Separate todos into completed and pending
        completed_todos = todos.filter(is_completed=True)
        pending_todos = todos.filter(is_completed=False)

        # Calculate the total number of projects
        total_projects = Project.objects.count()

        # Generate Markdown content
        markdown = f"# {project.title}\n\n"
        markdown += f"### Summary: {len(completed_todos)} Completed / {len(todos)} Total\n\n"
        markdown += f"### Total Projects AVALIBLE: {total_projects}\n\n"
        
        # Section 1: Pending Todos
        markdown += "## Section 1: Task list of pending todos\n"
        for todo in pending_todos:
            markdown += f"- [ ] {todo.title} ({todo.description or 'No description'})\n"
        
        # Section 2: Completed Todos
        markdown += "\n## Section 2: Task list of completed todos\n"
        for todo in completed_todos:
            markdown += f"- [x] {todo.title} ({todo.description or 'No description'})\n"

        return markdown

    except Project.DoesNotExist:
        return None
    

def export_summary_to_gist(project_id):
    # Generate the project summary
    markdown_content = generate_project_summary(project_id)
    if markdown_content is None:
        return {"success": False, "error": "Project not found."}

    # Debug: Print the content being sent
    print("Markdown content to be exported:\n", markdown_content)

    # API endpoint and headers
    url = "https://api.github.com/gists"
    headers = {"Authorization": f"token {GITHUB_TOKEN}"}
    
    # Payload for the Gist
    payload = {
        "description": f"Summary for project ID {project_id}",
        "public": False,
        "files": {
            "project_summary.md": {
                "content": markdown_content
            }
        }
    }

    # Create the Gist using POST request
    response = requests.post(url, json=payload, headers=headers)

    # Handle the response
    if response.status_code == 201:  # Successfully created
        return {"success": True, "url": response.json()["html_url"]}
    else:
        return {"success": False, "error": response.json()}

    
def create_gist_directly():

    url = "https://api.github.com/gists"
    headers = {"Authorization": f"token {GITHUB_TOKEN}"}
    payload = {
        "description": "Test Gist",
        "public": False,
        "files": {
            "test.md": {
                "content": "# Test Gist\n\nThis is a test."
            }
        }
    }

    response = requests.post(url, json=payload, headers=headers)
    if response.status_code == 201:
        return {"success": True, "url": response.json()["html_url"]}
    else:
        return {"success": False, "error": response.json()}


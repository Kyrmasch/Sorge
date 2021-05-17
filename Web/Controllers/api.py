from flask import request, render_template, jsonify

def get_tables():
    return jsonify({'result': []})
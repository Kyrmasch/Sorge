from pymongo import MongoClient
from bson.objectid import ObjectId

class DbProvider(object):

    def __init__(self, config):
        self.client = MongoClient('mongodb://localhost:27017/')

    def check(self):
        if self.check() == False:
            return

        return True

    def add(self, array):
        if self.check() == False:
            return

        if type(array) == "list":
            for item in array:
                self.client.sorge.insert(
                    {
                        '_id': ObjectId(item["id"])
                    }
                )
        else:
            print("MONGO: add first parament in not array")

    def update(self, array):
        if self.check() == False:
            return
        pass

    def get(self, id):
        if self.check() == False:
            return

        return self.client.sorge.find_one({'_id': ObjectId(id)})

    def remove(self, id):
        if self.check() == False:
            return
        
        self.client.sorge.delete_one({'_id': ObjectId(id)})  
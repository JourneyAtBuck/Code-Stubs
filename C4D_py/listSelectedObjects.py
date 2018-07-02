import c4d
from c4d import gui
#Welcome to the world of Python


def main():
    dumpers = doc.GetActiveObjects(0)
    for obj in dumpers:
        print obj.GetName()

if __name__=='__main__':
    main()

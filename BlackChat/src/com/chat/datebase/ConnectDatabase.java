package com.chat.datebase;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import java.io.PrintWriter;
import java.sql.*;
import java.sql.DriverManager;
import java.util.ArrayList;
import java.util.Queue;
import java.util.TreeMap;

/**
 * Created by Алексей on 12.03.2015.
 */
public class ConnectDatabase{
    private Connection connectBase = null;
    private TreeMap<Integer,ArrayList<JSONObject>> timingMails;
    private int userID(String log){
        String command = "SELECT*FROM users WHERE login = '"+log+"'";
        try{
            Statement st = connectBase.createStatement();
            ResultSet rs = st.executeQuery(command);
            while (rs.next())
            {
                int t =  rs.getInt(3);
                st.close();
                return t;
            }
            st.close();
        }catch (SQLException e){}
        return -1;
    }
    public String userName(int id){
        String command = "SELECT*FROM users WHERE ID = '"+id+"'";
        try{
            Statement st = connectBase.createStatement();
            ResultSet rs = st.executeQuery(command);
            while (rs.next())
            {
                String t =  rs.getString("login");
                st.close();
                return t;
            }
            st.close();
        }catch (SQLException e){}
        return null;
    }
    public ConnectDatabase(){
        try{
            Class.forName("com.mysql.jdbc.Driver").newInstance();
            System.out.println("Driver loading success!");
        } catch (Exception e){
            String s =e.toString();
        }
        try{
            connectBase = DriverManager.getConnection("jdbc:mysql://127.0.0.1:3306/blackchat","root","admin");
        } catch (SQLException e){}
        timingMails = new TreeMap<Integer, ArrayList<JSONObject>>();
    }
    public void addUser(String log, String psw){
        String command = "INSERT INTO users (login, psw) VALUES('"+log+"','"+psw+"')";
        try{
            Statement st = connectBase.createStatement();
            st.executeUpdate(command);
            st.close();
        }catch (SQLException e){}
    }
    public void destroy(){
        try{
            connectBase.close();
        }catch (SQLException e){}
    }
    public int containsUser(String log, String psw){
        String command = "SELECT*FROM users WHERE login = '"+log+"'";
        try{
            Statement st = connectBase.createStatement();
            ResultSet rs = st.executeQuery(command);
            while (rs.next())
            {
                String s = rs.getString("psw");
                if(psw.equals(s)) {
                    int t =  rs.getInt(3);
                    st.close();
                    return t;
                }
            }
            st.close();
        }catch (SQLException e){}
        return -1;
    }
    public void addMail(int firstID,JSONObject jsonFile,PrintWriter out) {
        String secName = (String)jsonFile.get("nameSecond");
        String text = (String) jsonFile.get("text");
        int secondID = userID(secName);
        try{
            Statement st = connectBase.createStatement();
            ResultSet rs = st.executeQuery("SELECT*FROM dialogs WHERE firstID = "+firstID+" AND secondID = "+secondID);
            int mailID  = -1;
            int countMail = -1;
            while (rs.next()){
                mailID = rs.getInt("mailID");
                countMail = rs.getInt("countMails");
            }
            if(mailID != -1){
                countMail ++;
                st.executeUpdate("INSERT INTO mails VALUE ("+firstID+","+mailID+",'"+text+"',"+countMail+")");
                st.executeUpdate("UPDATE  dialogs Set countMails = countMails+1 WHERE (firstID ="+firstID+" AND secondID = "+secondID+") OR (firstID = "+secondID+" AND secondID = "+firstID+")");
            }
            else{
                rs = st.executeQuery("SELECT*FROM mails WHERE mailID =(SELECT MAX(mailID) FROM mails)");
                rs.next();
                mailID = rs.getInt("mailID") + 1;
                out.print(mailID);
                st.executeUpdate("INSERT INTO dialogs VALUE ("+firstID+","+secondID+","+mailID+",1)");
                st.executeUpdate("INSERT INTO dialogs VALUE ("+secondID+","+firstID+","+mailID+",1)");
                st.executeUpdate("INSERT INTO mails VALUE ("+firstID+","+mailID+",'"+text+"',"+mailID+")");
            }
        }catch (SQLException e){}
        if(timingMails.containsKey(secondID)){
            ArrayList<JSONObject> arrayList = timingMails.get(secondID);
            arrayList.add(jsonFile);
        }
        else {
            ArrayList<JSONObject> arrayList = new ArrayList<JSONObject>();
            arrayList.add(jsonFile);
            timingMails.put(secondID,arrayList);
        }
    }
    public JSONArray respClient(int userID){
        if(!timingMails.containsKey(userID)){
            return null;
        }
        if(timingMails.get(userID).isEmpty()){
            return null;
        }
        JSONArray array = new JSONArray();
        array.addAll(timingMails.get(userID));
        timingMails.get(userID).clear();
        return array;
    }
    public JSONArray respUsers(int userID){
        JSONArray array = new JSONArray();
        try{
            Statement st = connectBase.createStatement();
            ResultSet rs = st.executeQuery("SELECT *FROM users");
            while (rs.next()){
                JSONObject object = new JSONObject();
                object.put("name",rs.getString("login"));
                int id = rs.getInt("ID");
                if(id == userID){
                    object.put("flag","1");
                }else {
                    object.put("flag","0");
                }
                Statement stSecond = connectBase.createStatement();
                ResultSet res = stSecond.executeQuery("SELECT * FROM dialogs WHERE firstID="+userID+" AND secondID="+id);
                int index = -1;
                if(res.next()){
                    index = res.getInt("mailID");
                }
                object.put("dialogID",index);
                array.add(object);
            }
            st.close();

        }catch (SQLException e){}
        return array;
    }
    public JSONArray respStart(int userID){
        JSONArray array = new JSONArray();
        ArrayList<JSONObject> ar = timingMails.get(userID);
        if(ar!=null){
            ar.clear();
        }
        try{
            Statement st = connectBase.createStatement();
            ResultSet rs = st.executeQuery("SELECT * FROM dialogs WHERE firstID ="+userID);
            while (rs.next()){
                int mailID = rs.getInt("mailID");
                ResultSet result = st.executeQuery("SELECT *FROM mails WHERE mailID="+mailID+" ORDER BY mailSecID ");
                while (result.next()){
                    int outID = result.getInt("outID");
                    String text = result.getString("text");
                    JSONObject object = new JSONObject();
                    object.put("name",userName(outID));
                    object.put("text",text);
                    object.put("dialogID",mailID);
                    array.add(object);
                }
                result.close();
            }
            st.close();
        }catch (SQLException e){}
        return array;
    }
}